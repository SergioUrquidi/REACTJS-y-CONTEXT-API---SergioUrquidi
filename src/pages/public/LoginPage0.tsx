import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import { schemaLogin } from '../../models/login.model';
import z from 'zod';

interface LoginData {
  username: string;
  password: string;
}

interface ActionState {
  errors: Partial<Record<keyof LoginData, string>>;
  message: string;
  formData?: Partial<LoginData>;
}

const initialState: ActionState = {
  errors: {},
  message: '',
};

const login = async (
  _: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const rawData = {
    username: formData.get('username'),
    password: formData.get('password'),
  };

  try {
    const validatedData = schemaLogin.parse(rawData);
    console.log('validatedData--------', validatedData);
    console.log('rawData--------', rawData);
    return {
      errors: {},
      message: `User ${validatedData.username} Login`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return {
        errors: fieldErrors,
        message: 'Paso un problema',
        formData: rawData as LoginData,
      };
    }
    return {
      errors: {},
      message: 'Paso un problema',
      formData: rawData as LoginData,
    };
  }
};

export const LoginPage = () => {
  const [state, submitAction, isPending] = useActionState(login, initialState);

  return (
    <Container component={'main'} maxWidth="sm">
      <Box>
        <Paper elevation={3}>
          <Typography>LOGIN</Typography>

          <Typography variant="body2">Proyecto Diplomado para REACT</Typography>

          <Box component={'form'} action={submitAction} sx={{ width: '100%' }}>
            <TextField
              label="Username"
              name="username"
              type="text"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isPending}
              defaultValue={state.formData?.username}
              error={!!state.errors.username}
              helperText={state.errors.username}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isPending}
              defaultValue={state.formData?.password}
              error={!!state.errors.password}
              helperText={state.errors.password}
            />

            <Button type="submit" disabled={isPending}>
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
