<?php

namespace App\Http\Requests\Concerns;

trait ProvidesPortugueseValidation
{
    public function messages(): array
    {
        return [
            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser um texto.',
            'integer' => 'O campo :attribute deve ser um número inteiro.',
            'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',
            'array' => 'O campo :attribute deve ser uma lista.',
            'email' => 'O campo :attribute deve ser um e-mail válido.',
            'url' => 'O campo :attribute deve ser uma URL válida.',
            'date' => 'O campo :attribute deve ser uma data válida.',
            'after_or_equal' => 'O campo :attribute deve ser uma data posterior ou igual a :date.',
            'max.string' => 'O campo :attribute não pode ter mais de :max caracteres.',
            'max.file' => 'O arquivo enviado em :attribute não pode ter mais que :max kilobytes.',
            'min.numeric' => 'O campo :attribute deve ser no mínimo :min.',
            'exists' => 'O valor informado para :attribute é inválido.',
            'unique' => 'O valor informado para :attribute já está em uso.',
            'distinct' => 'O campo :attribute não pode conter valores duplicados.',
            'image' => 'O campo :attribute deve ser uma imagem válida.',
            'file' => 'O campo :attribute deve ser um arquivo válido.',
            'mimes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
            'in' => 'O valor informado para :attribute é inválido.',
        ];
    }

    public function attributes(): array
    {
        return [
            'email' => 'e-mail',
            'password' => 'senha',
            'deviceName' => 'nome do dispositivo',
            'name' => 'nome',
            'title' => 'título',
            'slug' => 'slug',
            'summary' => 'resumo',
            'description' => 'descrição',
            'coverImage' => 'imagem de capa',
            'externalUrl' => 'URL externa',
            'regionId' => 'região',
            'cityId' => 'cidade',
            'startsAt' => 'data de início',
            'endsAt' => 'data de término',
            'isPublished' => 'status de publicação',
            'isFeatured' => 'destaque',
            'interestTagIds' => 'tags de interesse',
            'interestTagIds.*' => 'tag de interesse',
            'attractions' => 'atrações',
            'attractions.*.id' => 'atração',
            'attractions.*.name' => 'nome da atração',
            'attractions.*.description' => 'descrição da atração',
            'attractions.*.imageUrl' => 'imagem da atração',
            'attractions.*.sortOrder' => 'ordem da atração',
            'attractions.*.isPublished' => 'publicação da atração',
            'gallery' => 'galeria',
            'gallery.*.mediaAssetId' => 'item de mídia da galeria',
            'gallery.*.sortOrder' => 'ordem da galeria',
            'gallery.*.altText' => 'texto alternativo da galeria',
            'gallery.*.isCover' => 'imagem de capa da galeria',
            'collection' => 'coleção',
            'file' => 'arquivo',
            'altText' => 'texto alternativo',
            'page' => 'página',
            'per_page' => 'quantidade por página',
            'q' => 'busca',
            'search' => 'busca',
            'region' => 'região',
            'region_id' => 'região',
            'city' => 'cidade',
            'city_id' => 'cidade',
            'tag' => 'tag',
            'tag_id' => 'tag',
            'published' => 'publicado',
            'featured' => 'destaque',
            'future' => 'futuro',
        ];
    }
}
