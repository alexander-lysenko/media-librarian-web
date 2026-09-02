<?php

namespace App\Utils\Enum;

/**
 * Defines commonly used Regular Expression patterns throughout the application
 */
enum RegexPatternsEnum: string
{
    public const LIBRARY_TITLE = '/^([\p{L}\p{N} ]+[-_]?)+$/usD';
    public const LIBRARY_FIELD = '/^([\p{L}\p{N}]+[-_ ]?)+$/iusD';

    case E_LIBRARY_TITLE = self::LIBRARY_TITLE;
    case E_LIBRARY_FIELD = self::LIBRARY_FIELD;
}
