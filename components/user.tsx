import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import db, { getAllUsers } from 'utils/db';
import DownloadIcon from '@mui/icons-material/Download';

export default function User() {
  const [user, setUser] = useState({ name: '' });

  const [users, setUsers] = useState<
    (PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> | undefined)[]
  >([]);

  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    const users = await getAllUsers();

    setUsers(users);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (user && file) {
      await db.post({
        ...user,
        _attachments: {
          [0]: {
            content_type: file.type,
            data: file,
          },
        },
      });
    }

    await getAll();
  };

  const isPDFFile = (base64Param: string): boolean => {
    const decodedData = Buffer.from(base64Param, 'base64').toString('binary');
    return decodedData.startsWith('%PDF');
  };

  return (
    <>
      <Card sx={{ maxWidth: 600 }} variant="outlined">
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Prova de conceito
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={8}>
                <label>
                  Nome:
                  <Input type="text" name="name" onChange={handleInputChange} />
                </label>
              </Grid>
              <Grid item xs={8}>
                <label>
                  File:
                  <Input
                    type="file"
                    name="file"
                    onChange={(e) =>
                      setFile(e.target.files?.length ? e.target.files[0] : null)
                    }
                  />
                </label>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button variant="contained" type="submit">
              Salvar
            </Button>
          </CardActions>
        </form>
      </Card>{' '}
      <br />
      <Card sx={{ maxWidth: 800 }} variant="outlined">
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="center">Anexo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">
                    {isPDFFile(row._attachments[0].data) ? (
                      <a
                        download="PDF Title"
                        href={`data:application/pdf;base64,${row._attachments[0].data}`}
                      >
                        <DownloadIcon />
                      </a>
                    ) : (
                      <img
                        width={50}
                        height={50}
                        src={`data:image/png;base64,${row._attachments[0].data}`}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}
