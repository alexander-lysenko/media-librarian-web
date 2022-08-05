<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Signup Form Request (API v1)
 *
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $passwordRepeat
 * @property string $locale
 * @property string $theme
 */
class SignupRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // for user's account
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'passwordRepeat' => ['required', 'same:password'],

            // for user's personal settings
            'locale' => ['string', 'max:5'],
            'theme' => ['string'],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

}
