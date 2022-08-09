<?php

namespace App\Utils\Enum;

/**
 * List of available statuses (states) for user's account
 */
class UserStatusEnum
{
    public const STATUS_CREATED = 'CREATED';
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_BANNED = 'BANNED';
    public const STATUS_DELETED = 'DELETED';

    public function cases(): array
    {
        return [
            self::STATUS_CREATED => 'CREATED',
            self::STATUS_ACTIVE => 'ACTIVE',
            self::STATUS_BANNED => 'BANNED',
            self::STATUS_DELETED => 'DELETED',
        ];
    }
}
