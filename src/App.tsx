import { Header } from "./components/Header";

import "./App.scss";

import lupa from "./assets/lupa.png";
import vector from "./assets/vector.png";
import closeModalIcon from "./assets/closeModal.svg";
import pokeBall from "./assets/pokeBall.svg";

import { useEffect, useState } from "react";
import Modal from "react-modal";

import { Pagination } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface Pokemon {
  id: string;
  name: string;
  images: { small: string; large: string };
  rarity: string;
  types: [string];
  flavorText: string;
  hp: string;
  text: string;
  abilities: [{ name: string }];
  attacks: [{ name: string }];
  weaknesses: [{ type: string }];
  resistances: [{ type: string }];
}

interface ApiResults {
  data: Pokemon[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

const PAGE_SIZE = 20;
const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
});

export default function App() {
  const [pokemon, setPokemon] = useState<ApiResults>();
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [inputValueComplete, setInputValueComplete] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    let search = inputValue ? `name:${inputValue}` : "";
    if (selectedType) {
      search = search.concat(`types:${selectedType}`);
    }
    const q = search ? `&q=${search}` : "";
    setIsLoading(true);
    fetch(
      `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${PAGE_SIZE}${q}`
    )
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
        setIsLoading(false);
      });
  }, [inputValue, page, selectedType]);

  useEffect(() => {
    fetch(`https://api.pokemontcg.io/v2/types`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonTypes(data.data);
      });
  }, []);

  function openModal(pokemon: Pokemon) {
    setSelectedPokemon(pokemon);
  }

  function closeModal() {
    setSelectedPokemon(null);
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = pokemon?.totalCount
    ? Math.ceil(pokemon.totalCount / PAGE_SIZE)
    : 1;

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setSelectedType(event.target.value as string);
  };

  return (
    <>
      <Header />
      <div>
        <div className="filters">
          <div className="input-search">
            <Autocomplete
              disablePortal
              style={{ border: "none" }}
              options={
                Array.from(
                  new Set(pokemon?.data.map((pokemon) => pokemon.name))
                ) ?? []
              }
              className="input-search"
              renderInput={(params) => (
                <CssTextField {...params} placeholder="Pesquise um pokemon" />
              )}
              value={inputValue}
              onChange={(event: any, newValue: string | null) => {
                setInputValue(newValue);
              }}
              inputValue={inputValueComplete}
              onInputChange={(event, newInputValue) => {
                setInputValueComplete(newInputValue);
              }}
            />
            <img src={lupa} alt="" />
          </div>

          <div className="filter">
            <img src={vector} alt="" />
            <span>Filtar por:</span>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedType}
              label="Age"
              onChange={handleChangeSelect}
              className="select"
            >
              <MenuItem value="">Todos</MenuItem>
              {pokemonTypes.map((pokemonType) => (
                <MenuItem key={pokemonType} value={pokemonType}>
                  {pokemonType}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="count">
          <img src={pokeBall} />
          <span>Total: {pokemon?.totalCount} Pokemons</span>
        </div>

        <div className="content">
          {isLoading && (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading &&
            pokemon?.data?.map((pokemon) => (
              <div
                className="containerCard"
                key={pokemon.id}
                onClick={() => openModal(pokemon)}
              >
                <div className="card">
                  <img src={pokemon.images.small} alt={pokemon.name} />
                </div>
                <div className="footerCard">
                  <h2>{pokemon.name}</h2>
                  <p className="types">{pokemon?.types?.[0]}</p>
                  <p>{pokemon.rarity}</p>
                </div>
              </div>
            ))}
          <Pagination
            className="pagination"
            count={totalPages}
            page={page}
            onChange={handleChange}
            size="large"
          />
        </div>
      </div>

      <Modal
        isOpen={!!selectedPokemon}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="customStyles"
        contentLabel="Example Modal"
      >
        <div className="headerModal">
          <h2>{selectedPokemon?.name}</h2>
          <span onClick={closeModal}>
            <img src={closeModalIcon} alt="" />
          </span>
        </div>
        <div>
          <img id="pokemon" src={selectedPokemon?.images.small} alt="" />
        </div>
        <div className="atkDef">
          <p className="weaknesses">{selectedPokemon?.weaknesses?.[0].type}</p>
          <p className="resistances">
            {selectedPokemon?.resistances?.[0].type}
          </p>
        </div>
        <div className="info">
          <div>
            <span>
              <img src={pokeBall} alt="" /> Habilidades
            </span>
            <p>{selectedPokemon?.abilities?.[0].name}</p>
          </div>
          <div>
            <span>
              <img src={pokeBall} alt="" /> Ataque
            </span>
            <p>{selectedPokemon?.attacks?.[0].name}</p>
          </div>
          <div>
            <span>
              <img src={pokeBall} alt="" /> HP
            </span>
            <p>{selectedPokemon?.hp}</p>
          </div>
        </div>
        <div>
          <p>{selectedPokemon?.flavorText}</p>
        </div>
      </Modal>
    </>
  );
}
