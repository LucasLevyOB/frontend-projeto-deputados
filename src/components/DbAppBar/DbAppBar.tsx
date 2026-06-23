import { styled, alpha, type SxProps } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../theme';
import { Tooltip } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '180px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    },
  },
}));

interface DbAppBarProps {
  sx?: SxProps;
}

const DbAppBar = ({ sx }: DbAppBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState('');
  const { isDarkMode, toggleTheme } = useThemeContext();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const executeSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (searchValue.trim()) {
      params.set('nome', searchValue.trim());
    } else {
      params.delete('nome');
    }

    params.delete('page');
    navigate({ pathname: '/deputados', search: params.toString() });
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleSearchClick = () => {
    executeSearch();
  };

  return (
    <Box sx={sx}>
      <AppBar variant='elevation' position="static">
        <Toolbar>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu de navegação"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => handleNavigate('/')}>
                <Typography sx={{ textAlign: 'center' }}>Início</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleNavigate('/deputados')}>
                <Typography sx={{ textAlign: 'center' }}>Deputados</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Box
            sx={{
              width: 128,
            }}
            src="/logo_branca.png"
            alt="Logo"
            component='img'
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2, gap: 1 }}>
            <Button
              onClick={() => handleNavigate('/')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Início
            </Button>
            <Button
              onClick={() => handleNavigate('/deputados')}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Deputados
            </Button>
          </Box>

          <Tooltip title={isDarkMode ? 'Tema claro' : 'Tema escuro'}>
            <IconButton sx={{ ml: 1, mr: 1 }} onClick={toggleTheme} color="inherit" aria-label="Alternar tema">
              {isDarkMode ? <DarkModeOutlined /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          <Search>
            <SearchIconWrapper>
              <IconButton size="small" onClick={handleSearchClick} color="inherit" aria-label="Pesquisar" sx={{ ml: -0.5 }}>
                <SearchIcon />
              </IconButton>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Pesquise..."
              inputProps={{ 'aria-label': 'Pesquisar' }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DbAppBar;
