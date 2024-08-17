from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np

def apply_frosted_glass_effect(image, radius=100):
    """
    Apply a frosted glass effect using a Gaussian blur to the image.

    :param image: PIL Image object
    :param radius: Radius of the blur (higher value = more frostiness)
    :return: PIL Image object with frosted glass effect
    """
    # Convert PIL Image to OpenCV format
    open_cv_image = np.array(image)
    open_cv_image = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2BGR)
    
    # Apply a Gaussian blur to simulate frosted glass
    frosted_image = cv2.GaussianBlur(open_cv_image, (radius, radius), 0)
    
    # Convert back to PIL Image
    frosted_image = cv2.cvtColor(frosted_image, cv2.COLOR_BGR2RGB)
    return Image.fromarray(frosted_image)

def darken_image(image, factor=0.5):
    """
    Darken the image by a given factor.

    :param image: PIL Image object
    :param factor: Factor by which to darken the image (0.0 - 1.0)
    :return: Darkened PIL Image object
    """
    enhancer = ImageEnhance.Brightness(image)
    return enhancer.enhance(factor)

# Load the background image
image = Image.open('assets/images/background.jpeg')

# Darken the image
darkened_image = darken_image(image, factor=0.5)

# Apply frosted glass effect
frosted_glass_image = apply_frosted_glass_effect(darkened_image, radius=25)

# Save the result
frosted_glass_image.save('output_image.jpeg')