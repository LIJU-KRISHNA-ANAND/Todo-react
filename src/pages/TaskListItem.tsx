// components/TaskListItem.tsx
import {
  ListItem,
  IconButton,
  Checkbox,
  ListItemText,
  Tooltip,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { memo } from "react";

type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: Priority;
}

interface TaskListItemProps {
  task: Task;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const priorityColors = {
  low: "success",
  medium: "warning",
  high: "error",
};

const TaskListItem = ({
  task,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onToggle,
}: TaskListItemProps) => {
  return (
    <ListItem
      key={task.id}
      disablePadding
      divider
      sx={{
        mb: 1,
        p: 1,
        backgroundColor: task.completed ? "action.hover" : "inherit",
        borderRadius: 1,
      }}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <Tooltip title="Move Up">
            <span>
              <IconButton
                edge="end"
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                size="small"
              >
                <ArrowUpwardIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Move Down">
            <span>
              <IconButton
                edge="end"
                onClick={() => onMoveDown(index)}
                disabled={index === total - 1}
                size="small"
              >
                <ArrowDownwardIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Edit Task">
            <IconButton
              component={RouterLink}
              to={`/edit/${task.id}`}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Task">
            <IconButton
              onClick={() => onDelete(task.id)}
              size="small"
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
      <ListItemText
        primary={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "text.secondary" : "text.primary",
                mr: 1,
              }}
            >
              {task.text}
            </Typography>
            <Chip
              label={task.priority}
              size="small"
              color={priorityColors[task.priority] as any}
              sx={{ ml: 1 }}
            />
          </Box>
        }
        secondary={
          task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )
        }
      />
    </ListItem>
  );
};

export default memo(TaskListItem);
