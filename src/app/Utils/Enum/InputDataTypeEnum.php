<?php

namespace App\Utils\Enum;

/**
 * Enumerates data types of all available inputs for Library Items
 */
enum InputDataTypeEnum: string
{
    case LINE = 'line';
    case TEXT = 'text';
    case DATE = 'date';
    case DATETIME = 'datetime';
    case URL = 'url';
    case CHECKBOX = 'checkmark';
    case RATING_5 = 'rating5';
    case RATING_5_PRECISION = 'rating5precision';
    case RATING_10 = 'rating10';
    case RATING_10_PRECISION = 'rating10precision';
    case PRIORITY = 'priority';
}
