<?php

namespace App\Utils\Enum;

/**
 * Enumerates data types of all available inputs for Library Items
 */
enum InputDataTypeEnum: string
{
    public const LINE = 'line';
    public const TEXT = 'text';
    public const DATE = 'date';
    public const DATETIME = 'datetime';
    public const URL = 'url';
    public const CHECKBOX = 'checkmark';
    public const RATING_5 = 'rating5';
    public const RATING_5_PRECISION = 'rating5precision';
    public const RATING_10 = 'rating10';
    public const RATING_10_PRECISION = 'rating10precision';
    public const PRIORITY = 'priority';

    case E_LINE = self::LINE;
    case E_TEXT = self::TEXT;
    case E_DATE = self::DATE;
    case E_DATETIME = self::DATETIME;
    case E_URL = self::URL;
    case E_CHECKBOX = self::CHECKBOX;
    case E_RATING_5 = self::RATING_5;
    case E_RATING_5_PRECISION = self::RATING_5_PRECISION;
    case E_RATING_10 = self::RATING_10;
    case E_RATING_10_PRECISION = self::RATING_10_PRECISION;
    case E_PRIORITY = self::PRIORITY;
}
