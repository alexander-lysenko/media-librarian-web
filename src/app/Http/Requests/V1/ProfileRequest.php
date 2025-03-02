<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @property string $name
 * @property string $email
 * @property string $avatar
 * @property string $locale
 * @property string $theme
 */
class ProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['string'],
            'email' => ['email', 'max:128', 'unique:users,email'],
            'avatar' => ['nullable', 'starts_with:data:image/jpeg;base64,data:image/png;base64'],

            // for user's personal settings
            'locale' => ['string', 'max:5', Rule::in(['en', 'ru'])],
            'theme' => ['string', Rule::in(['light', 'dark'])],
        ];
    }
}
