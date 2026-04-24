import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useActionState } from 'react';
import { schemaLogin, type LoginFormValues } from '../../models/login.model';
import type { ActionState } from '../../interfaces';
import { createInitialState, handleZodErros } from '../../helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert, useAuth, useAxios } from '../../hooks';

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type LoginActionState = ActionState<LoginFormValues>;
const initialState = createInitialState<LoginFormValues>();
export const LoginPage = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();

  const loginApi = async (
    _: LoginActionState | undefined,
    formData: FormData,
  ): Promise<LoginActionState | undefined> => {
    const rawData: LoginFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
    try {
      schemaLogin.parse(rawData);
      //await delay(5000);
      const response = await axios.post('login', rawData);
      if (!response?.data?.token) throw new Error('Token no existe');
      login(response.data.token, { username: rawData.username });
      showAlert('Bienvenido', 'success');
      navigate('/perfil');
    } catch (error) {
      const err = handleZodErros<LoginFormValues>(error, rawData);
      console.log('error', err);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    loginApi,
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
            LOGIN
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Proyecto Diplomado para REACT
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
              {isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <Link to={'/user'}>Registrar nuevo usuario</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
