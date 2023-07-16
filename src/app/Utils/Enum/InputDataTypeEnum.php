<?php

namespace App\Utils\Enum;

/**
 * Class InputDataTypeEnum
 */
class InputDataTypeEnum
{
    public const LINE_INPUT = 'line';
    public const TEXT_INPUT = 'text';
    public const DATE_INPUT = 'date';
    public const DATETIME_INPUT = 'datetime';
    public const URL_INPUT = 'url';
    public const CHECKBOX_INPUT = 'checkmark';
    public const RATING_5_INPUT = 'rating5';
    public const RATING_5_PRECISION_INPUT = 'rating5precision';
    public const RATING_10_INPUT = 'rating10';
    public const RATING_10_PRECISION_INPUT = 'rating10precision';
    public const PRIORITY_INPUT = 'priority';

    public const TYPE_UI_NAME = [
        self::LINE_INPUT => self::LINE_INPUT,
        self::TEXT_INPUT => self::TEXT_INPUT,
        self::DATE_INPUT => self::DATE_INPUT,
        self::DATETIME_INPUT => self::DATETIME_INPUT,
        self::URL_INPUT => self::URL_INPUT,
        self::CHECKBOX_INPUT => self::CHECKBOX_INPUT,
        self::RATING_5_INPUT => self::RATING_5_INPUT,
        self::RATING_5_PRECISION_INPUT => self::RATING_5_PRECISION_INPUT,
        self::RATING_10_INPUT => self::RATING_10_INPUT,
        self::RATING_10_PRECISION_INPUT => self::RATING_10_PRECISION_INPUT,
        self::PRIORITY_INPUT => self::PRIORITY_INPUT,
    ];
}
