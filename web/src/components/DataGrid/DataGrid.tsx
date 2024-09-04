import * as React from 'react'

import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { debounce } from 'lodash'

interface CustomDataGridProps {
  rows: GridRowsProp
  columns: GridColDef[]
  refetch: () => void
  setOpenNewStudentDialog: () => void
  setOpenCreateAssessmentDialog: (id: string) => void
  handleSubmitGrade: (
    assignmentId: string,
    studentId: string,
    grade: string,
    gradeId?: string
  ) => void
  handleDeleteAssignment: (assignmentId: string) => void
  viewMode: 'stars' | 'numbers'
  changeViewMode: (mode: 'stars' | 'numbers') => void
}

const EditToolbar = React.memo(function EditToolbar({
  searchValue,
  onSearchChange,
  numOfRows,
  setNumOfRows,
  density,
  setDensity,
  setOpenNewStudentDialog,
  setOpenCreateAssessmentDialog,
  groupedColumns,
  visibleColumns,
  toggleGroup,
  changeViewMode,
  viewMode,
  sx, // Add sx to the props
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
  setOpenCreateAssessmentDialog: (id: string) => void
  groupedColumns: Record<string, string[]>
  visibleColumns: Set<string>
  changeViewMode: (mode: 'stars' | 'numbers') => void
  viewMode: 'stars' | 'numbers'
  toggleGroup: (headerName: string) => void
  sx?: object // Add sx to the type definition
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

  const [inputNumOfRows, setInputNumOfRows] = React.useState(numOfRows)

  const debouncedSetNumOfRows = React.useMemo(
    () => debounce((value: number) => setNumOfRows(value), 500),
    [setNumOfRows]
  )

  const handleNumOfRowsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputNumOfRows(Number(event.target.value))
    debouncedSetNumOfRows(Number(event.target.value))
  }

  return (
    <GridToolbarContainer sx={sx}>
      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          sx={{ width: 'auto' }}
          key="search-input"
          inputRef={searchInputRef}
          value={inputSearchValue}
          onChange={(e) => setInputSearchValue(e.target.value)}
          placeholder="Search student"
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
            marginLeft: '10px',
          }}
        >
          <SearchIcon />
        </Button>
      </Grid>
      <Grid item sx={{ width: '80px' }}>
        <TextField
          size="small"
          type="number"
          name="numOfRows"
          value={inputNumOfRows}
          onChange={handleNumOfRowsChange}
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
        onClick={() => setOpenCreateAssessmentDialog('')}
      >
        New assignment
      </Button>
      <FormControl variant="outlined" size="small" sx={{ marginLeft: 2 }}>
        <InputLabel>Column Groups</InputLabel>
        <Select
          label="Column Groups"
          multiple
          value={Object.keys(groupedColumns).filter((headerName) =>
            groupedColumns[headerName].every((field) =>
              visibleColumns.has(field)
            )
          )}
          //if render value is too long, add ... at the end
          renderValue={(selected) => {
            const maxLength = 15
            return selected.join(', ').length > maxLength
              ? `${selected.join(', ').substring(0, maxLength)}...`
              : selected.join(', ')
          }}
        >
          {Object.keys(groupedColumns).map((headerName) => (
            <MenuItem key={headerName} value={headerName}>
              <Checkbox
                checked={groupedColumns[headerName].every((field) =>
                  visibleColumns.has(field)
                )}
                onChange={() => toggleGroup(headerName)}
              />
              <ListItemText primary={headerName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Switch
        checked={viewMode === 'stars'}
        color="primary"
        onChange={() =>
          changeViewMode(viewMode === 'stars' ? 'numbers' : 'stars')
        }
      />
      <Typography>Stars</Typography>
    </GridToolbarContainer>
  )
})

export default function CustomDataGrid(props: CustomDataGridProps) {
  const {
    rows: initialRows,
    columns: initialColumns,
    handleSubmitGrade,
    setOpenCreateAssessmentDialog,
    handleDeleteAssignment,
    changeViewMode,
    viewMode,
    refetch,
  } = props
  const [rows, setRows] = React.useState(initialRows)
  const [searchText, setSearchText] = React.useState('')
  const [filteredRows, setFilteredRows] = React.useState(initialRows)
  const [columns, setColumns] = React.useState(initialColumns)
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map((c) => c.field))
  )
  const handleSearchChange = (newValue: string) => {
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
    const grouped: Record<string, string[]> = {}
    columns.forEach((column: GridColDef) => {
      const groupName = column.headerName
      if (groupName && groupName !== 'Name') {
        if (!grouped[groupName]) {
          grouped[groupName] = []
        }
        grouped[groupName].push(column.field)
      }
    })
    return grouped
  }, [columns])

  const toggleGroup = (headerName: string) => {
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
    return columns.filter((column) => visibleColumns.has(column.field))
  }, [columns, visibleColumns])

  function DeleteAssignment(props: GridColumnMenuItemProps) {
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

  function EditAssignment(props: GridColumnMenuItemProps) {
    const { myCustomHandler, myCustomValue } = props
    return (
      <MenuItem onClick={myCustomHandler}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{myCustomValue}</ListItemText>
      </MenuItem>
    )
  }

  function CustomColumnMenu(props: GridColumnMenuProps) {
    console.log(props)
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuUserItem: DeleteAssignment,
          anotherColumnMenuUserItem: EditAssignment,
        }}
        slotProps={{
          columnMenuUserItem: {
            displayOrder: 15,
            myCustomValue: 'Delete Assignment',
            myCustomHandler: () => handleDeleteAssignment(props.colDef.field),
          },
          anotherColumnMenuUserItem: {
            displayOrder: 20,
            myCustomValue: 'Edit Assignment',
            myCustomHandler: () => {
              setOpenCreateAssessmentDialog(props.colDef.field)
            },
          },
        }}
      />
    )
  }

  return (
    <>
      <DataGrid
        sx={{
          width: '100%',
          overflow: 'auto',
        }}
        density={density}
        rows={filteredRows}
        columns={filteredColumns}
        editMode="cell"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={(newRow) => {
          const updatedRow = { ...newRow, isNew: false }
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
          return updatedRow
        }}
        onCellEditStop={(params: GridCellEditStopParams, event) => {
          const assignmentId = params.field
          const studentId = params.id.toString()
          const eventAsHtmlInputEvent =
            event as React.ChangeEvent<HTMLInputElement>
          const grade = eventAsHtmlInputEvent.target.value
          const gradeId = params.row[assignmentId]?.gradeId

          handleSubmitGrade(assignmentId, studentId, grade, gradeId)
          refetch()
        }}
        slots={{
          toolbar: () => (
            <EditToolbar
              sx={{
                paddingTop: '20px',
                display: 'flex',
                justifyContent: 'center',
              }}
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
              setOpenCreateAssessmentDialog={
                props.setOpenCreateAssessmentDialog
              }
              groupedColumns={groupedColumns}
              visibleColumns={visibleColumns}
              toggleGroup={toggleGroup}
              viewMode={viewMode}
              changeViewMode={changeViewMode}
            />
          ),
          columnMenu: CustomColumnMenu,
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </>
  )
}
