import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../app/store";
import { addTask, fetchTasks, updateTask } from "../features/tasks/taskSlice";

const initialFormValues = {
  text: "",
  priority: "medium",
  dueDate: "",
  completed: false,
};

const TaskFormPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const isEditMode = Boolean(taskId);

  const { tasks } = useAppSelector((state: RootState) => state.tasks);

  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && taskId) {
      const task = tasks.find((t) => t.id === parseInt(taskId));
      if (task) {
        setFormValues({
          text: task.text,
          priority: task.priority,
          dueDate: task.dueDate || "",
          completed: task.completed,
        });
      } else {
        navigate("/");
      }
    }
  }, [isEditMode, taskId, tasks, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formValues.text.trim()) {
      newErrors.text = "Task description is required";
      valid = false;
    }

    if (!formValues.priority) {
      newErrors.priority = "Priority is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode && taskId) {
      await dispatch(
        updateTask({
          id: parseInt(taskId),
          text: formValues.text,
          priority: formValues.priority as "low" | "medium" | "high",
          dueDate: formValues.dueDate || undefined,
          completed: formValues.completed,
        })
      );
    } else {
      await dispatch(
        addTask({
          text: formValues.text,
          priority: formValues.priority as "low" | "medium" | "high",
          dueDate: formValues.dueDate || undefined,
          completed: formValues.completed,
        })
      );
    }

    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Edit Task" : "Add New Task"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Task Description"
            name="text"
            value={formValues.text}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            error={Boolean(errors.text)}
            helperText={errors.text}
            required
          />

          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(errors.priority)}
          >
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={formValues.priority}
              label="Priority"
              onChange={handleSelectChange}
              required
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            {errors.priority && (
              <FormHelperText>{errors.priority}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Due Date"
            name="dueDate"
            type="date"
            value={formValues.dueDate}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{ flexGrow: 1 }}
            >
              {isEditMode ? "Update Task" : "Add Task"}
            </Button>
          </Stack>

          {isEditMode && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Task completion status can be toggled from the main list.
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskFormPage;
