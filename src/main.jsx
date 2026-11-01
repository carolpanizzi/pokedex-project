import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChevronDown, ChevronUp, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import './styles.css'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'
const LIMIT = 18
const TYPES = ['All', 'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy']
const typeMap = { normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric', grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison', ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug', rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark', steel: 'Steel', fairy: 'Fairy' }

const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1)
const formatNumber = (id) => `#${String(id).padStart(3, '0')}`

function PokemonCard({ pokemon, onSelect }) {
  const primaryType = pokemon.types[0]?.type.name || 'normal'
  return (
    <button className="pokemon-card" onClick={() => onSelect(pokemon)} aria-label={`View details for ${pokemon.name}`}>
      <span className="card-number">{formatNumber(pokemon.id)}</span>
      <img src={pokemon.sprites.other['official-artwork'].front_default} alt={formatName(pokemon.name)} loading="lazy" />
      <div className="card-info">
        <h2>{formatName(pokemon.name)}</h2>
        <span className={`type-pill type-${primaryType}`}>{typeMap[primaryType]}</span>
      </div>
    </button>
  )
}

function DetailModal({ pokemon, onClose }) {
  if (!pokemon) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="detail-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose} aria-label="Close details">×</button>
        <div className="detail-art">
          <span>{formatNumber(pokemon.id)}</span>
          <img src={pokemon.sprites.other['official-artwork'].front_default} alt={formatName(pokemon.name)} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">Pokémon #{pokemon.id}</p>
          <h2>{formatName(pokemon.name)}</h2>
          <div className="detail-types">{pokemon.types.map(({ type }) => <span className={`type-pill type-${type.name}`} key={type.name}>{typeMap[type.name]}</span>)}</div>
          <div className="stat-list">
            {pokemon.stats.slice(0, 3).map(({ stat, base_stat }) => (
              <div className="stat-row" key={stat.name}><span>{stat.name.replace('-', ' ')}</span><strong>{base_stat}</strong><i><em style={{ width: `${Math.min(base_stat, 100)}%` }} /></i></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [pokemon, setPokemon] = useState([])
  const [visibleCount, setVisibleCount] = useState(LIMIT)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`${API_URL}?limit=151`)
        if (!response.ok) throw new Error('Failed to load the Pokédex.')
        const data = await response.json()
        const details = await Promise.all(data.results.map(async (item) => {
          const result = await fetch(item.url)
          return result.json()
        }))
        setPokemon(details)
      } catch {
        setError('Unable to load Pokémon. Check your connection and try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchPokemon()
  }, [])

  const filteredPokemon = useMemo(() => pokemon.filter((item) => {
    const matchesSearch = item.name.includes(search.toLowerCase()) || String(item.id) === search
    const matchesType = selectedType === 'All' || item.types.some(({ type }) => typeMap[type.name] === selectedType)
    return matchesSearch && matchesType
  }), [pokemon, search, selectedType])

  const visiblePokemon = filteredPokemon.slice(0, visibleCount)

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Pokédex home"><span className="brand-mark">◒</span><span>Pokédex</span></a>
        <nav><a href="#explore">Explore</a><a href="#types">Types</a></nav>
        <button className="header-cta" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>Start exploring <span>→</span></button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> The Pokémon world in the palm of your hand</p>
          <h1>Find your<br /><em>favorite</em> Pokémon.</h1>
          <p className="hero-description">Explore, discover, and get to know every Pokémon. A Pokédex made for adventure lovers.</p>
          <button className="primary-button" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>Explore Pokédex <span>↗</span></button>
        </div>
        <div className="hero-art">
          <div className="sunburst" />
          <div className="hero-circle"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" /></div>
          <span className="floating-label label-top">#025</span><span className="floating-label label-bottom">Pikachu</span>
        </div>
      </section>

      <section className="explore-section" id="explore">
        <div className="section-heading"><div><p className="eyebrow">Your collection</p><h2>Discover new Pokémon</h2></div><p className="result-count">{filteredPokemon.length} results</p></div>
        <div className="toolbar">
          <label className="search-box"><Search size={20} /><input value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(LIMIT) }} placeholder="Search by name or number..." /></label>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={18} /> Filter by type {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        </div>
        <div className={`type-filters ${showFilters ? 'is-open' : ''}`} id="types">{TYPES.map((type) => <button className={selectedType === type ? 'active' : ''} key={type} onClick={() => { setSelectedType(type); setVisibleCount(LIMIT) }}>{type}</button>)}</div>
        {loading && <div className="status-message">Loading your Pokédex...</div>}
        {error && <div className="status-message error">{error}</div>}
        {!loading && !error && !visiblePokemon.length && <div className="status-message">No Pokémon found. Try another search.</div>}
        <div className="pokemon-grid">{visiblePokemon.map((item) => <PokemonCard key={item.id} pokemon={item} onSelect={setSelectedPokemon} />)}</div>
        {!loading && visibleCount < filteredPokemon.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + LIMIT)}>Load more <span>↓</span></button>}
      </section>
      <DetailModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
