import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageUploadField } from '../ImageUploadField';
import { renderWithProviders } from '../../../../test/utils';

const { mockUploadAdminMedia } = vi.hoisted(() => ({
  mockUploadAdminMedia: vi.fn(),
}));

describe('ImageUploadField', () => {
  beforeEach(() => {
    mockUploadAdminMedia.mockReset();
  });

  it('renderiza o campo com acoes de URL e upload', () => {
    renderWithProviders(
      <ImageUploadField
        id="cover-image"
        label="Imagem de capa"
        onChange={vi.fn()}
        value=""
      />,
    );

    expect(screen.getByPlaceholderText('https://exemplo.com/imagem.jpg')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Escolher arquivo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar imagem' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
  });

  it('mostra preview a partir de URL manual', () => {
    renderWithProviders(
      <ImageUploadField
        id="cover-image"
        label="Imagem de capa"
        onChange={vi.fn()}
        value="https://example.com/preview.jpg"
      />,
    );

    expect(screen.getByAltText('Pré-visualização')).toHaveAttribute('src', 'https://example.com/preview.jpg');
  });

  it('aceita URL local de storage retornada pelo upload', () => {
    renderWithProviders(
      <ImageUploadField
        id="cover-image"
        label="Imagem de capa"
        onChange={vi.fn()}
        value="/storage/tourism/media/2026/05/cover.jpg"
      />,
    );

    const input = screen.getByLabelText('Imagem de capa') as HTMLInputElement;

    expect(input).toHaveAttribute('type', 'text');
    expect(input.checkValidity()).toBe(true);
    expect(screen.getByAltText('Pré-visualização')).toHaveAttribute('src', '/storage/tourism/media/2026/05/cover.jpg');
  });

  it('faz upload do arquivo selecionado e propaga a URL retornada', async () => {
    const handleChange = vi.fn();
    const handleUploadStateChange = vi.fn();

    mockUploadAdminMedia.mockResolvedValue({
      id: 1,
      url: 'https://example.com/uploaded.jpg',
      size: 1024,
      collection: 'cover',
      altText: 'Vista da cidade',
    });

    renderWithProviders(
      <ImageUploadField
        altText="Vista da cidade"
        id="cover-image"
        label="Imagem de capa"
        onAltTextChange={vi.fn()}
        onChange={handleChange}
        onUpload={mockUploadAdminMedia}
        onUploadStateChange={handleUploadStateChange}
        value=""
      />,
    );

    const file = new File(['file-content'], 'cover.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Imagem de capa: selecionar arquivo');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText('cover.png')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockUploadAdminMedia).toHaveBeenCalledWith(file, {
        altText: 'Vista da cidade',
        collection: 'cover',
      });
    });

    expect(handleChange).toHaveBeenCalledWith('https://example.com/uploaded.jpg');
    expect(handleUploadStateChange).toHaveBeenNthCalledWith(1, true);
    expect(handleUploadStateChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByText('Upload concluído com sucesso.')).toBeInTheDocument();
  });

  it('permite reenviar manualmente depois da seleção', async () => {
    const user = userEvent.setup();

    mockUploadAdminMedia.mockResolvedValue({
      id: 1,
      url: 'https://example.com/uploaded.jpg',
      size: 1024,
      collection: 'cover',
      altText: null,
    });

    renderWithProviders(
      <ImageUploadField
        id="cover-image"
        label="Imagem de capa"
        onChange={vi.fn()}
        onUpload={mockUploadAdminMedia}
        value=""
      />,
    );

    const file = new File(['file-content'], 'cover.png', { type: 'image/png' });

    fireEvent.change(screen.getByLabelText('Imagem de capa: selecionar arquivo'), { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadAdminMedia).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('button', { name: 'Enviar imagem' }));

    await waitFor(() => {
      expect(mockUploadAdminMedia).toHaveBeenCalledTimes(2);
    });
  });

  it('exibe erro quando o upload falha', async () => {
    mockUploadAdminMedia.mockRejectedValue(new Error('Falha no upload.'));

    renderWithProviders(
      <ImageUploadField
        id="cover-image"
        label="Imagem de capa"
        onChange={vi.fn()}
        onUpload={mockUploadAdminMedia}
        value=""
      />,
    );

    const file = new File(['file-content'], 'cover.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Imagem de capa: selecionar arquivo');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Falha no upload.');
    });
  });
});
