<?php

namespace App\Http\Requests\V1;

use App\Utils\FileHelper;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PosterUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isActive();
    }

    public function prepareForValidation(): void
    {
        $requestContentType = $this->getContentTypeFormat();

        if ($requestContentType === 'json') {
            $this->validate(['poster' => ['required', 'string']]);
            $poster = FileHelper::fromBase64($this->input('poster'));
        } else {
            $this->validate(['poster' => ['required', 'file']]);
            $poster = $this->file('poster');
        }

        $this->merge(['poster' => $poster]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'poster' => ['image', 'mimes:jpeg,png,webp,bitmap', 'max:2048'],
        ];
    }
}
