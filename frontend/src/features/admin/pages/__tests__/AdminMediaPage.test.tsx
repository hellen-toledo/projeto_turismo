import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminMediaPage } from '../AdminMediaPage';

const { mockUploadMedia, mockDeleteMedia } = vi.hoisted(() => ({
  mockUploadMedia: vi.fn(),
  mockDeleteMedia: vi.fn(),
}));

vi.mock('../../hooks/useAdminMedia', () => ({
  useAdminMedia: () => ({
    data: {
      data: [
        {
          id: 7,
          url: 'https://example.com/media.jpg',
          path: 'tourism/media/2026/04/media.jpg',
          originalName: 'media.jpg',
          mimeType: 'image/jpeg',
          size: 1200,
          collection: 'gallery',
          altText: 'Imagem de teste',
        },
      ],
      meta: {
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
        total: 1,
        from: 1,
        to: 1,
      },
    },
    isLoading: false,
    isError: false,
  }),
  useAdminMediaMutations: () => ({
    uploadMedia: mockUploadMedia,
    deleteMedia: mockDeleteMedia,
    uploading: false,
    deleting: false,
  }),
}));

describe('AdminMediaPage', () => {
  beforeEach(() => {
    mockUploadMedia.mockReset();
    mockUploadMedia.mockResolvedValue(undefined);
    mockDeleteMedia.mockReset();
    mockDeleteMedia.mockResolvedValue(undefined);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:preview'),
      revokeObjectURL: vi.fn(),
    });
  });

  it('envia uma mídia selecionada', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminMediaPage />, { route: '/admin/media' });

    await user.click(screen.getByRole('button', { name: 'Enviar mídia' }));

    const file = new File(['image'], 'foto.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);
    await user.click(screen.getByRole('button', { name: 'Confirmar e Enviar' }));

    await waitFor(() => {
      expect(mockUploadMedia).toHaveBeenCalledWith({
        file,
        altText: '',
        collection: 'general',
      });
    });
  });

  it('confirma antes de remover uma mídia', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminMediaPage />, { route: '/admin/media' });

    await user.click(screen.getByRole('button', { name: 'Remover' }));
    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('Remover mídia?')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Remover' }));

    await waitFor(() => {
      expect(mockDeleteMedia).toHaveBeenCalledWith(7);
    });
  });
});
