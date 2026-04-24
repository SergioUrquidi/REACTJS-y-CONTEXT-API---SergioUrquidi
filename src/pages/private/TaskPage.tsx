import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAlert, useAxios } from '../../hooks';

interface Task {
  id: number;
  name: string;
  done: boolean;
}

export const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const axios = useAxios();
  const { showAlert } = useAlert();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ data: Task[]; total: number }>(
          `/tasks?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`,
        );
        setTasks(response.data.data);
        setRowCount(response.data.total);
      } catch {
        showAlert('Error al cargar las tareas', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, paginationModel]);

  const refresh = () => setRefreshKey((k) => k + 1);

  const openCreate = () => {
    setEditingTask(null);
    setNameInput('');
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setNameInput(task.name);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setNameInput('');
    setEditingTask(null);
  };

  const handleSubmit = async () => {
    if (!nameInput.trim()) {
      showAlert('El nombre es obligatorio', 'warning');
      return;
    }
    try {
      setSubmitting(true);
      if (editingTask) {
        await axios.put(`/tasks/${editingTask.id}`, { name: nameInput });
        showAlert('Tarea actualizada', 'success');
      } else {
        await axios.post('/tasks', { name: nameInput });
        showAlert('Tarea creada', 'success');
      }
      closeDialog();
      refresh();
    } catch {
      showAlert('Error al guardar la tarea', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/tasks/${id}`);
      showAlert('Tarea eliminada', 'success');
      refresh();
    } catch {
      showAlert('Error al eliminar la tarea', 'error');
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await axios.patch(`/tasks/${task.id}`, { done: !task.done });
      showAlert('Estado actualizado', 'success');
      refresh();
    } catch {
      showAlert('Error al actualizar el estado', 'error');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Tarea', flex: 1, minWidth: 200 },
    {
      field: 'done',
      headerName: 'Estado',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Finalizada' : 'Pendiente'}
          color={params.value ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', height: '100%' }}>
          <IconButton
            size="small"
            color={params.row.done ? 'success' : 'default'}
            onClick={() => handleToggleStatus(params.row as Task)}
            title={params.row.done ? 'Marcar como pendiente' : 'Marcar como finalizada'}
          >
            {params.row.done ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={() => openEdit(params.row as Task)}
            title="Editar"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id as number)}
            title="Eliminar"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h5" fontWeight="bold">
          Mis Tareas
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nueva Tarea
        </Button>
      </Box>

      <DataGrid
        rows={tasks}
        columns={columns}
        loading={loading}
        autoHeight
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        getRowClassName={(params) => (params.row.done ? 'row-finalizada' : '')}
        sx={{
          '& .row-finalizada': {
            opacity: 0.6,
            '& .MuiDataGrid-cell': {
              textDecoration: 'line-through',
            },
            '& .MuiDataGrid-cell:last-of-type': {
              textDecoration: 'none',
            },
          },
        }}
      />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nombre de la tarea"
            fullWidth
            margin="normal"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            disabled={submitting}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
