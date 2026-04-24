import { useActionState } from 'react';
import { createInitialState, handleZodErros } from '../../helpers';
import type { ActionState } from '../../interfaces';
import { schemaUser, type UserFormValues } from '../../models';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert, useAxios } from '../../hooks';

export type UserActionState = ActionState<UserFormValues>;
const initialState = createInitialState<UserFormValues>();

export const UserPage = () => {
  const { showAlert } = useAlert();
  const axios = useAxios();
  const navigate = useNavigate();

  const createUserApi = async (
    _: UserActionState | undefined,
    formData: FormData,
  ): Promise<UserActionState | undefined> => {
    const rawData: UserFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };
    try {
      schemaUser.parse(rawData);
      await axios.post('/users', {
        username: rawData.username,
        password: rawData.password,
      });
      showAlert('Usuario creado', 'success');
      navigate('/login');
    } catch (error) {
      const err = handleZodErros<UserFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    createUserApi,
    initialState,
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#242424',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 'sm',
          display: 'flex',
          flexDirection: 'column', // para que los hijos se apilen verticalmente
          justifyContent: 'center', // centra verticalmente el contenido del box
          height: '100vh',
          textAlign: 'center', // para centrar texto dentro de hijos si quieres
        }}
      >
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component={'h1'} variant="h4" gutterBottom>
            NUEVO USUARIO
          </Typography>

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
              defaultValue={state?.formData?.username}
              error={!!state?.errors.username}
              helperText={state?.errors.username}
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
              defaultValue={state?.formData?.password}
              error={!!state?.errors.password}
              helperText={state?.errors.password}
            />

            <TextField
              label="Confirmar password"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              required
              disabled={isPending}
              defaultValue={state?.formData?.confirmPassword}
              error={!!state?.errors.confirmPassword}
              helperText={state?.errors.confirmPassword}
            />

            <Button
              type="submit"
              disabled={isPending}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? 'Registrando...' : 'Registrar'}
            </Button>
            <Link to={'/login'}>Iniciar sesión</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
