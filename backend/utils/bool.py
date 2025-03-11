def to_bool(x: str) -> bool:
    """
    Converts a string representation to a boolean value.

    The function checks if the capitalized input string is equal to "True".
    Only the string "True" (case-insensitive) will return True, all other
    strings will return False.

    Args:
        x (str): The string to convert to boolean.

    Returns:
        bool: True if the input string is "True" (case-insensitive),
              False otherwise.

    Examples:
        >>> to_bool("True")
        True
        >>> to_bool("true")
        True
        >>> to_bool("FALSE")
        False
        >>> to_bool("anything else")
        False
    """
    return x.capitalize() == "True"
