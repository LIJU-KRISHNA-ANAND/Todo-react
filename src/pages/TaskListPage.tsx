// src/pages/TaskListPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskListItem from "./TaskListItem";
import { FixedSizeList as VirtualList } from "react-window";
import { useAppDispatch, useAppSelector } from "../hooks";
import { RootState } from "../app/store";
import { deleteTask, fetchTasks, moveTask, toggleComplete } from "../features/tasks/taskSlice";

const TaskListPage = () => {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((state: RootState) => state.tasks);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      if (filter === "high") return task.priority === "high";
      if (filter === "medium") return task.priority === "medium";
      if (filter === "low") return task.priority === "low";
      return true;
    });
  }, [tasks, filter]);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      dispatch(
        moveTask({ id: tasks[index].id, direction: "up" })
      );
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < tasks.length - 1) {
      dispatch(
        moveTask({ id: tasks[index].id, direction: "down" })
      );
    }
  };


  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Task List
          </Typography>

          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              label="Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="low">Low Priority</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredTasks.length === 0 && filter === "all" ? (
            <Card
              variant="outlined"
              sx={{
                textAlign: "center",
                backgroundColor: "background.default",
                py: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  No tasks found
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {filter !== "all"
                    ? "Try changing the filter or add a new task."
                    : "Get started by adding your first task!"}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to="/add"
                >
                  Add New Task
                </Button>
              </CardActions>
            </Card>
          ) : (
            <VirtualList
              height={400}
              itemCount={filteredTasks.length}
              itemSize={80}
              width="100%"
            >
              {({ index, style }) => {
                const task = filteredTasks[index];
                const originalIndex = tasks.findIndex((t) => t.id === task.id);
                return (
                  <div style={style} key={task.id}>
                    <TaskListItem
                      task={task}
                      index={originalIndex}
                      total={tasks.length}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                      onDelete={(id) => dispatch(deleteTask(id))}
                      onToggle={(id) => dispatch(toggleComplete(id))}
                    />
                  </div>
                );
              }}
            </VirtualList>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TaskListPage;
