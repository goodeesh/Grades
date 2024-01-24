import * as React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import FolderIcon from '@mui/icons-material/Folder'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd'

interface Item {
  id: string
  primary: string
}

interface DraggableListProps {
  items: Item[]
}

const DraggableList: React.FC<DraggableListProps> = ({ items }) => {
  // const [dense, setDense] = React.useState(false)
  // const [secondary, setSecondary] = React.useState(false)
  const dense = false // or false, depending on your needs
  const secondary = false
  const handleDragEnd = (result: any) => {
    // Handle the drag end logic here
    console.log(result)
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => (
            <Box
              sx={{ flexGrow: 1, maxWidth: 752 }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <List dense={dense}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(
                      provided: DraggableProvided
                      // snapshot: DraggableStateSnapshot
                    ) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.primary}
                          secondary={secondary ? 'Secondary text' : null}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}

export default DraggableList
