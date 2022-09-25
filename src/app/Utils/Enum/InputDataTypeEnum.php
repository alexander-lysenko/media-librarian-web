<?php

namespace App\Utils\Enum;

/**
 * Class InputDataTypeEnum
 */
class InputDataTypeEnum
{
    public const STRING_INPUT = 'string';
    public const TEXT_INPUT = 'text';
    public const DATE_INPUT = 'date';
    public const DATETIME_INPUT = 'datetime';
    public const URL_INPUT = 'url';
    public const CHECKBOX_INPUT = 'checkbox';
    public const RATING5_INPUT = 'rating(5)';
    public const RATING10_INPUT = 'rating(10)';
    public const PRIORITY_INPUT = 'priority';

    private const STRING_DB = 'varchar(255)';
    private const TEXT_DB = 'text';
    private const DATE_DB = 'date';
    private const DATETIME_DB = 'datetime';
    private const URL_DB = 'varchar(254)';
    private const CHECKBOX_DB = 'boolean';
    private const RATING5_DB = 'tinyint';
    private const RATING10_DB = 'smallint';
    private const PRIORITY_DB = 'int';

    public const DB_TO_UI_MAP = [
        self::STRING_DB => self::STRING_INPUT,
        self::TEXT_DB => self::TEXT_INPUT,
        self::DATE_DB => self::DATE_INPUT,
        self::DATETIME_DB => self::DATETIME_INPUT,
        self::URL_DB => self::URL_INPUT,
        self::CHECKBOX_DB => self::CHECKBOX_INPUT,
        self::RATING5_DB => self::RATING5_INPUT,
        self::RATING10_DB => self::RATING10_INPUT,
        self::PRIORITY_DB => self::PRIORITY_INPUT,
    ];

    public const UI_TO_DB_MAP = [
        self::STRING_INPUT => self::STRING_DB,
        self::TEXT_INPUT => self::TEXT_DB,
        self::DATE_INPUT => self::DATE_DB,
        self::DATETIME_INPUT => self::DATETIME_DB,
        self::URL_INPUT => self::URL_DB,
        self::CHECKBOX_INPUT => self::CHECKBOX_DB,
        self::RATING5_INPUT => self::RATING5_DB,
        self::RATING10_INPUT => self::RATING10_DB,
        self::PRIORITY_INPUT => self::PRIORITY_DB,
    ];

    public const TYPE_UI_NAME = [
        self::STRING_INPUT => 'line',
        self::TEXT_INPUT => 'text',
        self::DATE_INPUT => 'date',
        self::DATETIME_INPUT => 'datetime',
        self::URL_INPUT => 'url',
        self::CHECKBOX_INPUT => 'checkmark',
        self::RATING5_INPUT => 'rating_5stars',
        self::RATING10_INPUT => 'rating_10stars',
        self::PRIORITY_INPUT => 'priority',
    ];
}
