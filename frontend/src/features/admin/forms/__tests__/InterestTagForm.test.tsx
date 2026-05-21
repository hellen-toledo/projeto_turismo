import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../../test/utils';
import { InterestTagForm } from '../InterestTagForm';

const { mockCreateInterestTag, mockUpdateInterestTag } = vi.hoisted(() => ({
  mockCreateInterestTag: vi.fn(),
  mockUpdateInterestTag: vi.fn(),
}));

vi.mock('../../hooks/useAdminInterestTags', () => ({
  useAdminInterestTagMutations: () => ({
    createInterestTag: mockCreateInterestTag,
    updateInterestTag: mockUpdateInterestTag,
    creating: false,
    updating: false,
  }),
}));

describe('InterestTagForm', () => {
  beforeEach(() => {
    mockCreateInterestTag.mockReset();
    mockUpdateInterestTag.mockReset();
  });

  it('exibe erro de validação', async () => {
    const user = userEvent.setup();
    mockCreateInterestTag.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          errors: {
            slug: ['Slug já está em uso.'],
          },
        },
      },
    });

    renderWithProviders(<InterestTagForm />);

    fireEvent.change(screen.getByLabelText('Nome da tag'), { target: { value: 'Ecoturismo' } });
    fireEvent.change(screen.getByPlaceholderText('ecoturismo'), { target: { value: 'ecoturismo' } });

    await user.click(screen.getByRole('button', { name: 'Criar tag' }));

    expect(await screen.findByText('Revise os campos destacados.')).toBeInTheDocument();
    expect(screen.getByText('Slug já está em uso.')).toBeInTheDocument();
  });
});
