import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import { XIcon } from '@/components/XIcon';

const redeSocial: Record<string, { nome: string; icon: React.ReactNode }> = {
  'twitter.com': {
    nome: 'X',
    icon: <XIcon />
  },
  'x.com': {
    nome: 'X',
    icon: <XIcon />
  },
  'www.facebook.com': {
    nome: 'Facebook',
    icon: <FacebookIcon />
  },
  'www.instagram.com': {
    nome: 'Instagram',
    icon: <InstagramIcon />
  },
  'youtube.com': {
    nome: 'YouTube',
    icon: <YouTubeIcon />
  }
};

export const getRedeSocialIcon = (url: string) => {
  try {
    const urlObj = new URL(url.toLowerCase());
    const dominio = urlObj.hostname;
    return redeSocial[dominio]?.icon ?? <LanguageIcon />;
  } catch (error) {
    return <LanguageIcon />;
  }
};

export const getRedeSocialName = (url: string) => {
  try {
    const urlObj = new URL(url.toLowerCase());
    const dominio = urlObj.hostname;
    return redeSocial[dominio]?.nome ?? 'Site Externo';
  } catch (error) {
    return 'Site Externo';
  }
};
