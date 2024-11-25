"""
This module provides functions for interacting with a Content Delivery Network (CDN) to upload, patch, and delete images.

It uses the imagekit API to perform these operations.

Functions:
- upload_image: Uploads an image to the CDN.
- patch_image: Patches an image in the CDN with a new image.
- delete_image: Deletes an image from the CDN.
"""

import base64
import os
import uuid
from io import BytesIO
from typing import Any, Optional, Tuple, Union
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

__all__ = [
    "upload_image",
    "patch_image",
    "delete_image",
    "upload_blog_images",
    "delete_blog_images",
    "patch_blog_images",
]

# load env variables
load_dotenv("..")

PUBLIC_KEY = os.getenv("IMGKIT_PUBLIC_KEY")
PRIVATE_KEY = os.getenv("IMGKIT_PRIVATE_KEY")
IMGKIT_ID = os.getenv("IMGKIT_ID")
URL_ENDPOINT = f"https://ik.imagekit.io/{IMGKIT_ID}/"

mime_to_extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/webp": ".webp",
    "image/tiff": ".tiff",
    "image/svg+xml": ".svg",
    "image/x-icon": ".ico",
    "image/heif": ".heif",
    "image/heic": ".heic",
}

imgkit = ImageKit(
    private_key=PRIVATE_KEY, public_key=PUBLIC_KEY, url_endpoint=URL_ENDPOINT
)


def get_file_extension(mime_type):
    extension = mime_to_extension.get(mime_type)
    return extension if extension else "bin"


def upload_image(
    image: FileStorage, name: str, tag: Optional[str] = None
) -> Union[Tuple[str, str], bool]:
    """
    Uploads an image to the CDN using the provided image file, name, and return type.

    Args:
        image (FileStorage): The image file to be uploaded.
        name (str): The name of the image file.

    Returns:
        Union[Tuple[str, str], bool]: A tuple containing the image URL and ID if the upload is successful,
        otherwise False.
    """
    # construct request
    options = UploadFileRequestOptions(
        use_unique_file_name=True,
        tags=[tag if tag else "education"],
        folder="/imgs/",
        is_private_file=False,
        is_published=True,
    )

    stream = base64.b64encode(image.stream.read())

    # Make request
    res = imgkit.upload_file(
        file=stream,
        file_name=name,
        options=options,
    )

    if res.response_metadata.http_status_code == 200:
        img_id = res.file_id
        img_url = res.url
        return (
            img_url,
            img_id,
        )
    else:
        return False


def patch_image(
    new_img: FileStorage, new_name: str, img_id: str, tag: Optional[str] = None
) -> Union[Tuple[str, str] | bool]:
    """
    Patch an image in the CDN with a new image.

    Args:
        new_img (FileStorage): The new image file to be uploaded.
        new_name (str): The name of the new image.
        img_id (str): The ID of the old image to be replaced.

    Returns:
        Union[Tuple[str, str], bool]: A tuple containing the new URL and ID of the patched image if successful,
        otherwise False.
    """
    # delete image
    res = delete_image(img_id)

    if not res:
        return False

    # reupload image
    if not tag:
        res = upload_image(new_img, new_name)
    else:
        res = upload_image(new_img, new_name, tag)

    if res:
        return (
            res[0],
            res[1],
        )
    else:
        return False


def delete_image(img_id: str) -> bool:
    """
    Deletes an image from the CDN.

    Args:
        img_id (str): The ID of the image to be deleted.

    Returns:
        bool: True if the image was successfully deleted, False otherwise.
    """

    # make request
    res = imgkit.delete_file(img_id)

    if res.response_metadata.http_status_code == 204:
        return True
    return False


def upload_blog_images(data: list[dict[Any, str]]) -> list[dict[Any, str]] | int:
    """
    Uploads blog images to a CDN or saves them locally.
    Args:
        data (List[Dict[Any, str]]): A list of dictionaries containing image data.
    Returns:
        List[Dict[Any, str]] | int: The modified list of dictionaries with updated image URLs and IDs, or an integer indicating an error.
    """
    # temp val until CDN service is running
    img_id = 1
    for row in data:
        if row["type"] == "img":
            img_url = urlparse(row["url"])

            if all([img_url.scheme, img_url.netloc]):
                res = requests.get(img_url.geturl(), stream=True)

                if res.status_code == 200:
                    image = FileStorage(BytesIO(res.content))

                    image_name = secure_filename(f"image_{uuid.uuid4().hex}.png")

                    imgkit_url, img_id = upload_image(image, image_name, "blog")
                    row["url"] = imgkit_url
                    row["id"] = img_id
                else:
                    continue
            else:
                image = FileStorage(BytesIO(bytes(row["url"])))
                image_name = secure_filename(f"image_{uuid.uuid4().hex}.png")
                imgkit_url, img_id = upload_image(image, image_name, "blog")
                row["url"] = imgkit_url
                row["id"] = img_id
    return data


def patch_blog_images(data: list[dict[Any, str]]) -> list[dict[Any, str]]:
    for row in data:
        if row["type"] == "img":
            img_id = row["id"]
            img_url = urlparse(row["url"])

            if all([img_url.scheme, img_url.netloc]):
                res = requests.get(img_url.geturl(), stream=True)

                if res.status_code == 200:
                    image = FileStorage(BytesIO(res.content))
                    image_name = secure_filename(f"image_{uuid.uuid4().hex}.png")

                    imgkit_url, img_id = patch_image(image, image_name, img_id, "blog")
                    row["url"] = imgkit_url
                    row["id"] = img_id
            else:
                image = FileStorage(BytesIO(bytes(row["url"])))
                image_name = secure_filename(f"image_{uuid.uuid4().hex}.png")

                imgkit_url, img_id = patch_image(image, image_name, img_id, "blog")
                row["url"] = imgkit_url
                row["id"] = img_id
    return data


def delete_blog_images(data: list[dict[Any, str]]) -> bool:
    """
    Deletes blog images from the CDN.
    Args:
        data (List[Dict[Any, str]]): A list of dictionaries containing information about the images.
    Returns:
        bool: True if all images were successfully deleted, False otherwise.
    """
    for row in data:
        if row["type"] == "img":
            img_id = row["id"]
            res = delete_image(img_id)

            if not res:
                return False
    return True
