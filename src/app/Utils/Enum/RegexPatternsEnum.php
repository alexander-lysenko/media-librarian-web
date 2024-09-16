<?php

namespace App\Utils\Enum;

/**
 * Enumerates common Regex (Regular Expressions) patterns used all around the project
 */
enum RegexPatternsEnum: string
{
    case LIBRARY_TITLE = '/^([\p{L}\p{N} ]+[-_]?)+$/usD';
    case LIBRARY_FIELD = '/^([\p{L}\p{N}]+[-_ ]?)+$/iusD';
}
