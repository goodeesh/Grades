import * as React from 'react'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import CancelIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import SearchIcon from '@mui/icons-material/Search'
import { Grid, ListItemIcon, ListItemText } from '@mui/material'
import { Select, MenuItem } from '@mui/material'
import { TextField, Button, InputAdornment } from '@mui/material' // Changed import
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import {
  GridColDef,
  GridRowModesModel,
  GridRowsProp,
  GridRowModes,
  GridActionsCellItem,
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
interface CustomDataGridProps {
  rows: GridRowsProp
  columns: GridColDef[]
  setOpenNewStudentDialog: () => void
  setOpenCreateAssesmentDialog: () => void
  handleSubmitGrade: (
    assignmentId: string,
    studentId: string,
    grade: string
  ) => void
}

const EditToolbar = React.memo(function EditToolbar({
  searchValue,
  onSearchChange,
  numOfRows,
  setNumOfRows,
  density,
  setDensity,
  setOpenNewStudentDialog,
  setOpenCreateAssesmentDialog,
}: {
  searchValue: string
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
  addNewColumn: () => void
  onSearchChange: (searchValue: string) => void
  searchText: string
  numOfRows: number
  setNumOfRows: (num: number) => void
  density: 'standard' | 'comfortable' | 'compact'
  setDensity: (density: 'standard' | 'comfortable' | 'compact') => void
  setOpenNewStudentDialog: () => void
  setOpenCreateAssesmentDialog: () => void
}) {
  const [inputSearchValue, setInputSearchValue] = React.useState(searchValue)
  const searchInputRef = React.useRef<HTMLInputElement | null>(null)
  const handleSearchClick = () => {
    onSearchChange(inputSearchValue)
  }
  const handleClearClick = () => {
    setInputSearchValue('')
    onSearchChange('')
  }

  return (
    <GridToolbarContainer>
      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          sx={{ width: 'auto' }}
          key="search-input"
          inputRef={searchInputRef}
          value={inputSearchValue}
          onChange={(e) => setInputSearchValue(e.target.value)}
          placeholder="Search..."
          variant="outlined"
          size="small"
          style={{ marginRight: 0 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchClick()
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {' '}
                {/* Key Change */}
                {inputSearchValue ? (
                  <IconButton onClick={handleClearClick}>
                    <ClearIcon />
                  </IconButton>
                ) : null}
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearchClick}
          sx={{
            marginLeft: '1px',
          }}
        >
          <SearchIcon />
        </Button>
      </Grid>
      <Grid item>
        <TextField
          size="small"
          type="number"
          name="numOfRows"
          value={numOfRows}
          onChange={(event) => setNumOfRows(Number(event.target.value))}
        />
      </Grid>
      <Grid item>
        <Select
          name="density"
          size="small"
          value={density}
          onChange={(event) =>
            setDensity(
              event.target.value as 'standard' | 'comfortable' | 'compact'
            )
          }
        >
          <MenuItem value="standard">Standard</MenuItem>
          <MenuItem value="comfortable">Comfortable</MenuItem>
          <MenuItem value="compact">Compact</MenuItem>
        </Select>
      </Grid>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={setOpenNewStudentDialog}
      >
        New student
      </Button>
      <Button
        color="secondary"
        startIcon={<AddIcon />}
        onClick={setOpenCreateAssesmentDialog}
      >
        New assesment
      </Button>
    </GridToolbarContainer>
  )
})

export default function CustomDataGrid(props: CustomDataGridProps) {
  const {
    rows: initialRows,
    columns: initialColumns,
    handleSubmitGrade,
  } = props
  const [rows, setRows] = React.useState(initialRows)
  const [searchText, setSearchText] = React.useState('')
  const [filteredRows, setFilteredRows] = React.useState(initialRows)
  const [columns, setColumns] = React.useState(initialColumns)
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map((c) => c.field))
  )
  const handleSearchChange = (newValue) => {
    setSearchText(newValue)
  }
  const [numOfRows, setNumOfRows] = React.useState(10)
  const [density, setDensity] = React.useState(
    'comfortable' as 'standard' | 'comfortable' | 'compact'
  )
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  )
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: numOfRows,
    page: 0,
  })
  React.useEffect(() => {
    setPaginationModel((prevModel) => ({
      ...prevModel,
      pageSize: numOfRows,
    }))
  }, [numOfRows])

  React.useEffect(() => {
    const lowerSearchText = searchText.toLowerCase()
    const searchRows = rows.filter((row) =>
      columns.some((column) => {
        const value = row[column.field]
        return value !== undefined
          ? value.toString().toLowerCase().includes(lowerSearchText)
          : false
      })
    )
    setFilteredRows(searchRows)
  }, [searchText, rows, columns])

  const addNewColumn = () => {
    const newColumn: GridColDef = {
      field: `newField${columns.length}`,
      headerName: `New Column ${columns.length}`,
      width: 150,
      editable: true,
    }
    setColumns([...columns, newColumn])
    setVisibleColumns(new Set([...visibleColumns, `newField${columns.length}`]))
  }

  const groupedColumns = React.useMemo(() => {
    const grouped = {}
    columns.forEach((column) => {
      const groupName = column.headerName || column.field
      if (!grouped[groupName]) {
        grouped[groupName] = []
      }
      grouped[groupName].push(column.field)
    })
    return grouped
  }, [columns])

  const toggleGroup = (headerName) => {
    setVisibleColumns((prevVisibleColumns) => {
      const newVisibleColumns = new Set(prevVisibleColumns)
      const allVisible = groupedColumns[headerName].every((field) =>
        newVisibleColumns.has(field)
      )
      groupedColumns[headerName].forEach((field) => {
        if (allVisible) {
          newVisibleColumns.delete(field)
        } else {
          newVisibleColumns.add(field)
        }
      })
      return newVisibleColumns
    })
  }

  const filteredColumns = React.useMemo(() => {
    return [
      ...columns
        .filter((column) => visibleColumns.has(column.field))
        .map((column) => ({
          ...column,
          headerName: column.headerName,
        })),
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 150,
        getActions: (params) => {
          const isInEditMode =
            rowModesModel[params.id]?.mode === GridRowModes.Edit
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                key={`${params.id}-save`}
                icon={<SaveIcon />}
                label="Save"
                onClick={() =>
                  setRowModesModel({
                    ...rowModesModel,
                    [params.id]: { mode: GridRowModes.View },
                  })
                }
              />,
              <GridActionsCellItem
                key={`${params.id}-cancel`}
                icon={<CancelIcon />}
                label="Cancel"
                onClick={() => {
                  setRowModesModel({
                    ...rowModesModel,
                    [params.id]: {
                      mode: GridRowModes.View,
                      ignoreModifications: true,
                    },
                  })
                  const editedRow = rows.find((row) => row.id === params.id)
                  if (editedRow && editedRow.isNew) {
                    setRows(rows.filter((row) => row.id !== params.id))
                  }
                }}
              />,
            ]
          }
          return [
            <GridActionsCellItem
              key={`${params.id}-edit`}
              icon={<EditIcon />}
              label="Edit"
              onClick={() =>
                // ... (Continued from previous portion)

                setRowModesModel({
                  ...rowModesModel,
                  [params.id]: { mode: GridRowModes.Edit },
                })
              }
            />,
            <GridActionsCellItem
              key={`${params.id}-delete`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() =>
                setRows(rows.filter((row) => row.id !== params.id))
              }
            />,
          ]
        },
      },
    ]
  }, [columns, rowModesModel, rows, visibleColumns])

  function CustomUserItem(props: GridColumnMenuItemProps) {
    const { myCustomHandler, myCustomValue } = props
    return (
      <MenuItem onClick={myCustomHandler}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{myCustomValue}</ListItemText>
      </MenuItem>
    )
  }

  function CustomColumnMenu(props: GridColumnMenuProps) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuUserItem: CustomUserItem,
        }}
        slotProps={{
          columnMenuUserItem: {
            displayOrder: 15,
            myCustomValue: 'Delete Column',
            myCustomHandler: () => handleDeleteColumn(props.colDef.field),
          },
        }}
      />
    )
  }

  function handleDeleteColumn(field) {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.field !== field)
    )
    setVisibleColumns(
      (prevVisibleColumns) =>
        new Set([...prevVisibleColumns].filter((f) => f !== field))
    )
  }

  return (
    <>
      <FormGroup row>
        {Object.keys(groupedColumns).map((headerName) => (
          <FormControlLabel
            key={headerName}
            control={
              <Checkbox
                checked={groupedColumns[headerName].every((field) =>
                  visibleColumns.has(field)
                )}
                onChange={() => toggleGroup(headerName)}
                name={headerName}
              />
            }
            label={headerName}
          />
        ))}
      </FormGroup>
      <Grid item>
        <DataGrid
          density={density}
          rows={filteredRows}
          columns={filteredColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={(newRow) => {
            const updatedRow = { ...newRow, isNew: false }
            setRows(
              rows.map((row) => (row.id === newRow.id ? updatedRow : row))
            )
            return updatedRow
          }}
          onRowEditStop={(params, event) => {
            const assignmentId = params.field
            const studentId = params.id
            const grade = event.target.value
            console.log(assignmentId, studentId, grade)
            handleSubmitGrade(assignmentId, studentId, grade)
          }}
          slots={{
            toolbar: () => (
              <EditToolbar
                onSearchChange={handleSearchChange}
                searchValue={searchText}
                setRows={setRows}
                addNewColumn={addNewColumn}
                searchText={searchText}
                numOfRows={numOfRows}
                setNumOfRows={setNumOfRows}
                density={density}
                setDensity={setDensity}
                setOpenNewStudentDialog={props.setOpenNewStudentDialog}
                setOpenCreateAssesmentDialog={
                  props.setOpenCreateAssesmentDialog
                }
              />
            ),
            columnMenu: CustomColumnMenu,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Grid>
    </>
  )
}
