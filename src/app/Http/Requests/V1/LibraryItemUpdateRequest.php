<?php

namespace App\Http\Requests\V1;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteLibraryMeta;
use App\Rules\LibraryItemStructureRule;
use App\Utils\FileHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the data passed to UPDATE an existing Item into an existing Library
 * @property int $id
 * @property int $item
 * @property array $contents
 */
class LibraryItemUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     * @return void
     */
    public function prepareForValidation(): void
    {
        $poster = null;
        if (!empty($this->input('poster'))) {
            $poster = FileHelper::fromBase64($this->input('poster'));
        }

        $this->merge([
            'id' => $this->route('id'),
            'item' => $this->route('item'),
            'poster' => $poster,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /**
         * If the upper level validation fails, an exception will be thrown and the rules below will never run.
         * If the upper level validation succeeds, the validated values may be used in the lower level rules.
         * ['id' => "1"] // Example of the result of succeeded validation (illustrated by field "id")
         */

        $idValidated = $this->validate([
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        $libraryTableName = SqliteLibraryMeta::query()
            ->where('id', $idValidated['id'])
            ->pluck('tbl_name')
            ->first();
        $libraryTablePath = implode('.', [DatabaseSwitch::CONNECTION_PATH, $libraryTableName]);

        $itemValidated = $this->validate([
            'item' => ['required', 'integer', 'min:1', Rule::exists($libraryTablePath, 'id')],
        ]);

        return [
            'contents' => ['required', new LibraryItemStructureRule($idValidated['id'], $itemValidated['item'])],
            'poster' => ['nullable', 'file', 'max:4096', 'mimes:jpg,png'],
        ];
    }
}
