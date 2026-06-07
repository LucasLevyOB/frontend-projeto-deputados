import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import DepudadosAPI from '@/services/DepudadosAPI';

import type { Deputado } from '@/types';
import { BarChart } from '@mui/x-charts';
import type { ResumoGastos } from '@/types/Deputado';

const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

const formatDataset = (resumoGastos: ResumoGastos[]): { gastos: number, mes: string }[] => {
    return resumoGastos[0].meses.map(({ mes, totalGasto }) => ({
        gastos: totalGasto,
        mes: meses[mes - 1],
    }));
}

export const DeputadoDetalhes = () => {
    const { id } = useParams<{ id: string }>();
    const [deputado, setDeputado] = useState<Deputado | null>(null);
    const [dataset, setDataset] = useState<{ gastos: number, mes: string }[]>([]);

    const chartSetting = {
        yAxis: [
            {
                label: 'Gastos',
                width: 60,
            },
        ],
        series: [{ dataKey: 'gastos', label: 'Gastos', valueFormatter: (value: number) => `R$ ${value}` }],
        height: 300,
        margin: { left: 0 },
    };


    const fetchDeputado = async (id: number) => {
        const api = new DepudadosAPI();
        const response = await api.getDeputado(id);

        setDeputado(response[0]);
        setDataset(formatDataset(response[0].resumoGastos));
        console.log(formatDataset(response[0].resumoGastos));
    };

    useEffect(() => {
        if (id) {
            fetchDeputado(Number(id));
        }
    }, [id]);

    if (!deputado) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                <Box>
                    <img src={deputado.urlFoto} alt={deputado.nome} />
                </Box>
                <Box>
                    <Typography variant="h4">{deputado.nome}</Typography>
                    <Typography variant="h6">{deputado.siglaPartido} - {deputado.siglaUf}</Typography>
                </Box>
            </Box>

            <Box>
                <BarChart
                    dataset={dataset}
                    xAxis={[{ dataKey: 'mes', tickPlacement: 'middle', tickLabelPlacement: 'tick' }]}
                    // yAxis={[{ label: 'Gastos', dataKey: 'gastos' }]}
                    series={[{ dataKey: 'gastos', label: 'Gastos' }]}
                    height={300}
                    width={600}
                    margin={{ left: 0 }}
                />
            </Box>
        </Box>
    );
};