<?php

namespace App\Http\Requests\V1;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteLibraryMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate uniqueness for a title of the Item of an existing Library.
 */
class ValidateLibraryItemNameRequest extends FormRequest
{
    /**
     * Indicates whether validation should stop after the first rule failure.
     * @var bool
     */
    protected $stopOnFirstFailure = true;

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
        $this->merge(['id' => $this->route('id')]);
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
         * ['id' => "1"] // This is the example of a successful validation result (illustrated by field "id")
         * ['item' => "1"] // This is the example of a successful validation result (illustrated by field "item")
         */

        $idValidated = $this->validate([
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        // Get the metadata of a Library
        /** @var SqliteLibraryMeta $libraryTable */
        $libraryTable = SqliteLibraryMeta::query()->find($idValidated['id'])?->firstOrFail();

        // Prepare the name of the first field
        $libraryTableMeta = json_decode($libraryTable->meta, true);
        $libraryNameColumn = array_keys($libraryTableMeta)[0];

        $libraryTablePath = implode('.', [DatabaseSwitch::CONNECTION_PATH, $libraryTable->tbl_name]);
        $itemValidated = $this->validate([
            'item' => ['integer', 'min:1', Rule::exists($libraryTablePath, 'id')],
        ]);

        $uniqueRule = Rule::unique($libraryTablePath, $libraryNameColumn)->ignore($itemValidated['item'] ?? null);

        return ['title' => ['required', 'string', $uniqueRule]];
    }
}
