"""
This module provides functions for interacting with a Content Delivery Network (CDN) to upload, patch, and delete images.

It uses the Cloudflare API to perform these operations.

Functions:
- upload_image: Uploads an image to the CDN.
- patch_image: Patches an image in the CDN with a new image.
- delete_image: Deletes an image from the CDN.
"""

import os
import uuid
from io import BytesIO
from typing import Any, Tuple, Union
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from werkzeug.datastructures import FileStorage

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

API_TOKEN = os.getenv("CLOUDFLARE_TOKEN")
CF_ID = os.getenv("CLOUDFLARE_ID")


def _get_cf_url(api_type: str) -> str:
    """
    Returns the Cloudflare URL based on the given API type.

    Parameters:
    - api_type (str): The type of API (either "image" or "file").

    Returns:
    - str: The Cloudflare URL for the specified API type.
    """
    match api_type:
        case "image":
            return "https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1".format(  # noqa: F523, F524
                CF_ID
            )
        case "image delete":
            return "https://api/cloudflare.com/client/v4/accounts/{account_id}/images/v1/{image_id}".format(  # noqa: F523, F524
                CF_ID
            )


def _match_image_return_type(return_type: str, variants: list[str]) -> str:
    """
    Matches the desired return type with the corresponding variant URL.

    Args:
        return_type (str): The desired return type of the image ("thumbnail", "hero", "full").
        variants (List[str]): The list of variant URLs for the image.

    Returns:
        str: The URL of the image variant that matches the desired return type.
    """
    match return_type:
        case "thumbnail":
            img_url = variants[0]
        case "hero":
            img_url = variants[1]
        case "full":
            img_url = variants[-1]
    return img_url


def upload_image(
    image: FileStorage, name: str, return_type: str
) -> Union[Tuple[str, str] | bool]:
    """
    Uploads an image to the CDN using the provided image file, name, and return type.

    Args:
        image (FileStorage): The image file to be uploaded.
        name (str): The name of the image file.
        return_type (str): The desired return type of the uploaded image ("thumbnail", "hero", "full").

    Returns:
        Union[Tuple[str, str], bool]: A tuple containing the image URL and ID if the upload is successful,
        otherwise False.
    """
    # construct request
    cf_url = _get_cf_url("image")

    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "multipart/form-data",
    }

    files = {
        "file": (
            name,
            image.stream,
            image.content_type,
        ),
    }

    # make request
    res = requests.post(cf_url, headers=headers, files=files)

    if res.status_code == 200:
        img = res.json()["result"]["images"][0]
        img_id: str = img["id"]
        variants: list[str] = img["variants"]

        img_url = _match_image_return_type(return_type, variants)
        return (
            img_url,
            img_id,
        )
    else:
        return False


def patch_image(
    new_img: FileStorage, new_name: str, img_id: str, return_type: str
) -> Union[Tuple[str, str] | bool]:
    """
    Patch an image in the CDN with a new image.

    Args:
        new_img (FileStorage): The new image file to be uploaded.
        new_name (str): The name of the new image.
        img_id (str): The ID of the old image to be replaced.
        return_type (str): The desired return type for the patched image.

    Returns:
        Union[Tuple[str, str], bool]: A tuple containing the new URL and ID of the patched image if successful,
        otherwise False.
    """

    res = delete_image(img_id)

    if not res:
        return False

    # construct request
    cf_url = _get_cf_url("image")

    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "multipart/form-data",
    }

    files = {
        "file": (
            new_name,
            new_img.stream,
            new_img.content_type,
        ),
    }

    # make request
    res = requests.post(cf_url, headers=headers, files=files)

    if res.status_code == 200:
        img = res.json()["result"]["images"][0]
        new_id: str = img["id"]
        variants: list[str] = img["variants"]

        new_url = _match_image_return_type(return_type, variants)
        return (
            new_url,
            new_id,
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
    # construct url
    cf_url = _get_cf_url("image delete").format(image_id=img_id)

    # construct request
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json",
    }

    # make request
    res = requests.delete(cf_url, headers=headers)

    if res.status_code == 200:
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

                    image_name = "image_" + uuid.uuid4().hex + ".png"

                    cf_url, img_id = upload_image(image, image_name, "full")
                    row["url"] = cf_url
                    row["id"] = img_id
                else:
                    continue
            else:
                image = FileStorage(BytesIO(bytes(row["url"])))
                image_name = "image_" + uuid.uuid4().hex + ".png"
                cf_url, img_id = upload_image(image, image_name, "full")
                row["url"] = cf_url
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
                    image_name = "image_" + uuid.uuid4().hex + ".png"

                    cf_url, img_id = patch_image(image, image_name, img_id, "full")
                    row["url"] = cf_url
                    row["id"] = img_id
            else:
                image = FileStorage(BytesIO(bytes(row["url"])))
                image_name = "image_" + uuid.uuid4().hex + ".png"

                cf_url, img_id = patch_image(image, image_name, img_id, "full")
                row["url"] = cf_url
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
