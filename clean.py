import cv2
import numpy as np
import numexpr as ne

# get grayscale image
def get_grayscale(image):
    #print(image.shape)
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


# noise removal
def remove_noise(image):
    return cv2.medianBlur(image, 5)


# thresholding
def thresholding(image):
    return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]


def adaptive_thresholding(img):
    # th2 = cv2.adaptiveThreshold(img,255,cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,11,2)
    th3 = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 75, 10)
    return th3


# dilation
def dilate(image):
    kernel = np.ones((5, 5), np.uint8)
    return cv2.dilate(image, kernel, iterations=1)


# erosion
def erode(image):
    kernel = np.ones((5, 5), np.uint8)
    return cv2.erode(image, kernel, iterations=1)


# opening - erosion followed by dilation
def opening(image):
    kernel = np.ones((5, 5), np.uint8)
    return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)


# canny edge detection
def canny(image):
    return cv2.Canny(image, 100, 200)


# skew correction
def deskew(image):
    coords = np.column_stack(np.where(image > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated


# template matching
def match_template(image, template):
    return cv2.matchTemplate(image, template, cv2.TM_CCOEFF_NORMED)

def bincount_numexpr_app(a):
    a2D = a.reshape(-1, a.shape[-1])
    col_range = (256, 256, 256) # generically : a2D.max(0)+1
    eval_params = {'a0':a2D[:,0],'a1':a2D[:,1],'a2':a2D[:,2],
                   's0':col_range[0],'s1':col_range[1]}
    a1D = ne.evaluate('a0*s0*s1+a1*s0+a2',eval_params)
    return np.unravel_index(np.bincount(a1D).argmax(), col_range)

def remove(image):
    gray = get_grayscale(image)
    g = adaptive_thresholding(gray)
    g = cv2.erode(g, np.ones((3, 3)), iterations=1)
    contours, f = cv2.findContours(g, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    cnts = sorted(contours, key=cv2.contourArea, reverse=True)[:3]
    mask = np.zeros([g.shape[0], g.shape[1]], dtype='uint8')

    cv2.fillPoly(mask, [cnts[0]], (255, 255, 255))
    res = cv2.bitwise_not(g, g, mask=mask)
    res = cv2.bitwise_and(g, g, mask=mask)
    kernel = np.ones((5, 5), np.uint8)
    res = cv2.dilate(res, kernel, iterations=2)
    res = np.where(res == 255, True, False)
    image2 = image
    image2[res] = bincount_numexpr_app(image)
    return image2
