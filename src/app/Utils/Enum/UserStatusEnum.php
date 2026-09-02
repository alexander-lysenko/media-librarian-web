<?php

namespace App\Utils\Enum;

/**
 * Enumerates all available statuses (states) for user's account
 */
enum UserStatusEnum: string
{
    public const CREATED = 'CREATED';
    public const ACTIVE = 'ACTIVE';
    public const BANNED = 'BANNED';
    public const DELETED = 'DELETED';

    case E_CREATED = self::CREATED;
    case E_ACTIVE = self::ACTIVE;
    case E_BANNED = self::BANNED;
    case E_DELETED = self::DELETED;
}
