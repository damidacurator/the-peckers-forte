<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'surname' => 'required|string|max:100',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date|before:today',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'state' => 'required|string',
            'lga' => 'required|string',
            'occupation' => 'nullable|string',
            'membership_category_id' => 'required|exists:membership_categories,id',
            'wing' => 'required|in:contribution,investment,both',
            'next_of_kin_name' => 'nullable|string|max:255',
            'next_of_kin_phone' => 'nullable|string|max:20',
            'next_of_kin_relationship' => 'nullable|string|max:100',
        ];
    }
}
