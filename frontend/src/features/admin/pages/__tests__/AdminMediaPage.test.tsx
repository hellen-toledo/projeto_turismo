import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { AdminMediaPage } from '../AdminMediaPage';

const { mockUploadMedia, mockDeleteMedia, mockConfirm } = vi.hoisted(() => ({
  mockUploadMedia: vi.fn(),
  mockDeleteMedia: vi.fn(),
  mockConfirm: vi.fn(),
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
    mockConfirm.mockReset();
    vi.stubGlobal('confirm', mockConfirm);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:preview'),
      revokeObjectURL: vi.fn(),
    });
  });

  it('envia uma mídia selecionada', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminMediaPage />, { route: '/admin/media' });

    const file = new File(['image'], 'foto.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);
    await user.click(screen.getByRole('button', { name: 'Enviar mídia' }));

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
    mockConfirm.mockReturnValue(true);

    renderWithProviders(<AdminMediaPage />, { route: '/admin/media' });

    await user.click(screen.getByRole('button', { name: 'Remover' }));

    expect(mockConfirm).toHaveBeenCalledWith('Tem certeza que deseja remover esta mídia? Esta ação não pode ser desfeita.');

    await waitFor(() => {
      expect(mockDeleteMedia).toHaveBeenCalledWith(7);
    });
  });
});
