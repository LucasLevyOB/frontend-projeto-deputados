import { useEffect, useState } from 'react';
import { Box, Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PartidosAPI from '@/services/PartidosAPI';
import { ESTADOS_UF, LEGISLATURAS_DISPONIVEIS, LEGISLATURA_PADRAO } from '@/utils';

interface DbFiltragemDeputadosProps {
    uf?: string;
    partido?: string;
    legislatura?: number;
    handleFilterChange: (filterName: string, value: string | null) => void;
}

const DbFiltragemDeputados = ({
    uf,
    partido,
    legislatura = LEGISLATURA_PADRAO,
    handleFilterChange
}: DbFiltragemDeputadosProps) => {
    const [partidos, setPartidos] = useState<{ sigla: string, nome: string }[]>([]);

    const fetchPartidos = async () => {
        const api = new PartidosAPI();
        const data = await api.getPartidos();
        setPartidos(data);
    };

    useEffect(() => {
        fetchPartidos();
    }, []);

    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
            <FormControl sx={{ minWidth: 190 }}>
                <InputLabel id="select-legislatura-label">Legislatura</InputLabel>
                <Select
                    labelId="select-legislatura-label"
                    value={legislatura}
                    label="Legislatura"
                    onChange={(e) => handleFilterChange('legislatura', e.target.value ? String(e.target.value) : null)}
                >
                    {LEGISLATURAS_DISPONIVEIS.map((leg) => (
                        <MenuItem key={leg.id} value={leg.id}>
                            {leg.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Autocomplete
                options={ESTADOS_UF}
                getOptionLabel={(option) => option.nome + ' (' + option.sigla + ')'}
                value={ESTADOS_UF.find(e => e.sigla === uf) || null}
                onChange={(_, newValue) => handleFilterChange('uf', newValue?.sigla || null)}
                renderInput={(params) => <TextField {...params} label="Estado (UF)" />}
                sx={{ width: 190 }}
            />
            <Autocomplete
                options={partidos}
                getOptionLabel={(option) => option.nome + ' (' + option.sigla + ')'}
                value={partidos.find(p => p.sigla === partido) || null}
                onChange={(_, newValue) => handleFilterChange('siglaPartido', newValue ? newValue.sigla : null)}
                renderInput={(params) => <TextField {...params} label="Partido" />}
                sx={{ width: 190 }}
                isOptionEqualToValue={(option, value) => option.sigla === value.sigla}
            />
        </Box>
    );
};

export default DbFiltragemDeputados;
