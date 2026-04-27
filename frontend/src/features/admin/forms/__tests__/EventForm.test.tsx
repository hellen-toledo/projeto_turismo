import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Event } from '../../../../shared/types/api';
import { renderWithProviders } from '../../../../test/utils';
import { EventForm } from '../EventForm';

const { mockCreateEvent, mockUpdateEvent } = vi.hoisted(() => ({
  mockCreateEvent: vi.fn(),
  mockUpdateEvent: vi.fn(),
}));

vi.mock('../../hooks/useAdminEvents', () => ({
  useAdminEventMutations: () => ({
    createEvent: mockCreateEvent,
    updateEvent: mockUpdateEvent,
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
              url: 'https://cdn.example.com/uploaded-event-image.jpg',
              altText: 'Imagem enviada',
              originalName: 'evento.jpg',
              size: 2048,
            });
            onChange('https://cdn.example.com/uploaded-event-image.jpg');
          }}
          type="button"
        >
          Simular upload {label}
        </button>
      ) : null}
    </div>
  ),
}));

const cityOptions = [{ value: '1', label: 'Porangatu' }];
const tagOptions = [{ value: '2', label: 'Gastronomia' }];

const makeEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 22,
  title: 'Festival Gastronômico',
  slug: 'festival-gastronomico',
  description: 'Programação cultural e gastronômica',
  startsAt: '2026-05-10T18:00:00.000Z',
  endsAt: '2026-05-10T23:00:00.000Z',
  coverImage: 'https://example.com/event.jpg',
  externalUrl: 'https://example.com/evento',
  isFeatured: true,
  isPublished: true,
  city: { id: 1, name: 'Porangatu', slug: 'porangatu' },
  interestTags: [{ id: 2, name: 'Gastronomia', slug: 'gastronomia' }],
  gallery: [
    {
      id: 11,
      url: 'https://example.com/gallery.jpg',
      altText: 'Galeria',
      size: 1024,
      isCover: true,
      sortOrder: 0,
    },
  ],
  ...overrides,
});

describe('EventForm', () => {
  beforeEach(() => {
    mockCreateEvent.mockReset();
    mockUpdateEvent.mockReset();
  });

  it('cria evento com imagem enviada', async () => {
    const user = userEvent.setup();
    mockCreateEvent.mockResolvedValue({});

    renderWithProviders(
      <EventForm
        cityOptions={cityOptions}
        tagOptions={tagOptions}
      />,
    );

    fireEvent.change(screen.getByLabelText('Título do evento'), { target: { value: 'Festa do Pequi' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Início'), { target: { value: '2026-06-01T18:00' } });
    fireEvent.change(screen.getByPlaceholderText('Descreva programação, público e contexto do evento.'), {
      target: { value: 'Celebração regional.' },
    });
    fireEvent.change(screen.getByLabelText('Imagem de capa'), { target: { value: 'https://cdn.example.com/capa.jpg' } });

    await user.click(screen.getByRole('button', { name: 'Criar evento' }));

    await waitFor(() => {
      expect(mockCreateEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Festa do Pequi',
          cityId: '1',
          coverImage: 'https://cdn.example.com/capa.jpg',
          description: 'Celebração regional.',
        }),
      );
    });
  });

  it('edita evento existente', async () => {
    const user = userEvent.setup();
    mockUpdateEvent.mockResolvedValue({});

    renderWithProviders(
      <EventForm
        cityOptions={cityOptions}
        event={makeEvent()}
        tagOptions={tagOptions}
      />,
    );

    const titleInput = screen.getByLabelText('Título do evento');
    await user.clear(titleInput);
    await user.type(titleInput, 'Festival Renovado');

    await user.click(screen.getByRole('button', { name: 'Atualizar evento' }));

    await waitFor(() => {
      expect(mockUpdateEvent).toHaveBeenCalledWith({
        eventId: 22,
        values: expect.objectContaining({
          title: 'Festival Renovado',
        }),
      });
    });
  });

  it('valida data final anterior ao início', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EventForm
        cityOptions={cityOptions}
        tagOptions={tagOptions}
      />,
    );

    fireEvent.change(screen.getByLabelText('Título do evento'), { target: { value: 'Festa do Pequi' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Início'), { target: { value: '2026-06-01T18:00' } });
    fireEvent.change(document.getElementById('event-ends-at') as HTMLInputElement, { target: { value: '2026-06-01T17:00' } });
    fireEvent.change(screen.getByPlaceholderText('Descreva programação, público e contexto do evento.'), {
      target: { value: 'Celebração regional.' },
    });

    await user.click(screen.getByRole('button', { name: 'Criar evento' }));

    expect(await screen.findByText('A data final deve ser igual ou posterior ao início.')).toBeInTheDocument();
    expect(mockCreateEvent).not.toHaveBeenCalled();
  });
});
