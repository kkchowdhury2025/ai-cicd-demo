import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/authService';

jest.mock('../services/authService');

describe('LoginForm', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('renders email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('shows error for invalid email', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'notanemail' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/valid email/i);
  });

  test('shows error for short password', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/6 characters/i);
  });

  test('calls authService.login with correct credentials', async () => {
    authService.login.mockResolvedValue({ success: true, user: { email: 'fe@demo.com', role: 'frontend' } });
    render(<LoginForm onLoginSuccess={jest.fn()} />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'fe@demo.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('fe@demo.com', 'password123');
    });
  });

  test('shows error on login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'fe@demo.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Invalid credentials/i);
  });
});
