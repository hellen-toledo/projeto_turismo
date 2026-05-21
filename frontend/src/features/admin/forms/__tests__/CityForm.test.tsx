import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { City } from '../../../../shared/types/api';
import { renderWithProviders } from '../../../../test/utils';
import { CityForm } from '../CityForm';

const { mockCreateCity, mockUpdateCity } = vi.hoisted(() => ({
  mockCreateCity: vi.fn(),
  mockUpdateCity: vi.fn(),
}));

vi.mock('../../hooks/useAdminCities', () => ({
  useAdminCityMutations: () => ({
    createCity: mockCreateCity,
    updateCity: mockUpdateCity,
    creating: false,
    updating: false,
  }),
}));

vi.mock('../../../../shared/components/form/ImageUploadField', () => ({
  ImageUploadField: ({
    altText,
    label,
    onAltTextChange,
    onChange,
    onUploadComplete,
    value,
  }: {
    altText?: string;
    label: string;
    onAltTextChange?: (value: string) => void;
    onChange: (value: string) => void;
    onUploadComplete?: (media: {
      id: number;
      url: string;
      altText?: string | null;
      originalName?: string;
      size: number;
    }) => void;
    value: string;
  }) => (
    <div>
      <label>
        {label}
        <input
          aria-label={label}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          value={value}
        />
      </label>
      {onAltTextChange ? (
        <label>
          {label} alt
          <input
            aria-label={`${label} alt`}
            onChange={(event) => {
              onAltTextChange(event.target.value);
            }}
          value={altText ?? ''}
        />
      </label>
      ) : null}
      {onUploadComplete ? (
        <button
          onClick={() => {
            onUploadComplete({
              id: 99,
              url: '/storage/tourism/media/2026/05/cidade.jpg',
              altText: 'Cidade enviada',
              originalName: 'cidade.jpg',
              size: 2048,
            });
            onChange('/storage/tourism/media/2026/05/cidade.jpg');
          }}
          type="button"
        >
          Simular upload {label}
        </button>
      ) : null}
    </div>
  ),
}));

const regionOptions = [{ value: '1', label: 'Chapada dos Veadeiros' }];
const tagOptions = [{ value: '2', label: 'Ecoturismo' }];

const makeCity = (overrides: Partial<City> = {}): City => ({
  id: 10,
  name: 'Alto Paraíso de Goiás',
  slug: 'alto-paraiso-de-goias',
  summary: 'Resumo',
  description: 'Descrição base',
  coverImage: 'https://example.com/city.jpg',
  isPublished: true,
  region: { id: 1, name: 'Chapada dos Veadeiros' },
  interestTags: [{ id: 2, name: 'Ecoturismo', slug: 'ecoturismo' }],
  attractions: [
    {
      id: 7,
      name: 'Mirante',
      description: 'Vista da cidade',
      imageUrl: 'https://example.com/attraction.jpg',
      sortOrder: 0,
      isPublished: true,
    },
  ],
  gallery: [
    {
      id: 11,
      url: 'https://example.com/gallery.jpg',
      altText: 'Galeria',
      size: 1234,
      isCover: true,
      sortOrder: 0,
    },
  ],
  ...overrides,
});

describe('CityForm', () => {
  beforeEach(() => {
    mockCreateCity.mockReset();
    mockUpdateCity.mockReset();
  });

  it('cria cidade com imagem de capa', async () => {
    const user = userEvent.setup();
    mockCreateCity.mockResolvedValue({});

    renderWithProviders(
      <CityForm
        regionOptions={regionOptions}
        tagOptions={tagOptions}
      />,
    );

    fireEvent.change(screen.getByLabelText('Nome da cidade'), { target: { value: 'Porangatu' } });
    fireEvent.change(screen.getByPlaceholderText('Descreva atrativos, contexto regional e diferenciais turísticos.'), {
      target: { value: 'Destino turístico no norte goiano.' },
    });
    fireEvent.change(screen.getByLabelText('Região'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Imagem de capa'), { target: { value: 'https://example.com/cover.jpg' } });

    await user.click(screen.getByRole('button', { name: 'Criar cidade' }));

    await waitFor(() => {
      expect(mockCreateCity).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Porangatu',
          description: 'Destino turístico no norte goiano.',
          coverImage: 'https://example.com/cover.jpg',
          regionId: '1',
        }),
      );
    });
  });

  it('vincula upload local da capa como mídia real da galeria', async () => {
    const user = userEvent.setup();
    mockCreateCity.mockResolvedValue({});

    renderWithProviders(
      <CityForm
        regionOptions={regionOptions}
        tagOptions={tagOptions}
      />,
    );

    fireEvent.change(screen.getByLabelText('Nome da cidade'), { target: { value: 'Porangatu' } });
    fireEvent.change(screen.getByPlaceholderText('Descreva atrativos, contexto regional e diferenciais turísticos.'), {
      target: { value: 'Destino turístico no norte goiano.' },
    });
    fireEvent.change(screen.getByLabelText('Região'), { target: { value: '1' } });

    await user.click(screen.getByRole('button', { name: 'Simular upload Imagem de capa' }));
    await user.click(screen.getByRole('button', { name: 'Criar cidade' }));

    await waitFor(() => {
      expect(mockCreateCity).toHaveBeenCalledWith(
        expect.objectContaining({
          coverImage: '/storage/tourism/media/2026/05/cidade.jpg',
          gallery: [
            expect.objectContaining({
              mediaAssetId: 99,
              url: '/storage/tourism/media/2026/05/cidade.jpg',
              isCover: true,
            }),
          ],
        }),
      );
    });
  });

  it('edita cidade com atrações', async () => {
    const user = userEvent.setup();
    const city = makeCity();
    mockUpdateCity.mockResolvedValue({});

    renderWithProviders(
      <CityForm
        city={city}
        regionOptions={regionOptions}
        tagOptions={tagOptions}
      />,
    );

    const attractionNameInput = screen.getByLabelText('Nome da atração');
    await user.clear(attractionNameInput);
    await user.type(attractionNameInput, 'Mirante Renovado');

    await user.click(screen.getByRole('button', { name: 'Atualizar cidade' }));

    await waitFor(() => {
      expect(mockUpdateCity).toHaveBeenCalledWith({
        cityId: 10,
        values: expect.objectContaining({
          attractions: [
            expect.objectContaining({
              id: 7,
              name: 'Mirante Renovado',
            }),
          ],
        }),
      });
    });
  });

  it('valida atração vazia antes de salvar', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CityForm
        regionOptions={regionOptions}
        tagOptions={tagOptions}
      />,
    );

    await user.type(screen.getByLabelText('Nome da cidade'), 'Porangatu');
    await user.type(screen.getByPlaceholderText('Descreva atrativos, contexto regional e diferenciais turísticos.'), 'Destino turístico no norte goiano.');
    await user.selectOptions(screen.getByLabelText('Região'), '1');
    await user.click(screen.getByRole('button', { name: 'Nova atração' }));
    await user.click(screen.getByRole('button', { name: 'Criar cidade' }));

    expect(await screen.findByText('Informe o nome da atração ou remova o bloco vazio.')).toBeInTheDocument();
    expect(mockCreateCity).not.toHaveBeenCalled();
  });
});
