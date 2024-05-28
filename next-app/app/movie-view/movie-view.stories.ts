import type { Meta, StoryObj } from '@storybook/react'

import { MovieView } from './movie-view'

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof MovieView> = {
  component: MovieView,
}

export default meta
type Story = StoryObj<typeof MovieView>

export const Movie: Story = {
  args: {
    movie: {
      details: {
        adult: false,
        backdrop_path: '/fqv8v6AycXKsivp1T5yKtLbGXce.jpg',
        belongs_to_collection: {
          id: 173710,
          name: 'Planet of the Apes (Reboot) Collection',
          poster_path: '/afGkMC4HF0YtXYNkyfCgTDLFe6m.jpg',
          backdrop_path: '/2ZkvqfOJUCINozB00wmYuGJQW81.jpg',
        },
        budget: 160000000,
        genres: [
          {
            id: 878,
            name: 'Science Fiction',
          },
          {
            id: 12,
            name: 'Adventure',
          },
          {
            id: 28,
            name: 'Action',
          },
        ],
        homepage:
          'https://www.20thcenturystudios.com/movies/kingdom-of-the-planet-of-the-apes',
        id: '653346',
        imdb_id: 'tt11389872',
        origin_country: ['US'],
        original_language: 'en',
        original_title: 'Kingdom of the Planet of the Apes',
        overview:
          "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
        popularity: 1585.42,
        poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
        production_companies: [
          {
            id: 127928,
            logo_path: '/h0rjX5vjW5r8yEnUBStFarjcLT4.png',
            name: '20th Century Studios',
            origin_country: 'US',
          },
          {
            id: 133024,
            logo_path: null,
            name: 'Oddball Entertainment',
            origin_country: 'US',
          },
          {
            id: 89254,
            logo_path: null,
            name: 'Jason T. Reed Productions',
            origin_country: 'US',
          },
        ],
        production_countries: [
          {
            iso_3166_1: 'US',
            name: 'United States of America',
          },
        ],
        release_date: '2024-05-08',
        revenue: 237000000,
        runtime: 145,
        spoken_languages: [
          {
            english_name: 'English',
            iso_639_1: 'en',
            name: 'English',
          },
        ],
        status: 'Released',
        tagline: 'No one can stop the reign.',
        title: 'Kingdom of the Planet of the Apes',
        video: false,
        vote_average: 7.178,
        vote_count: 510,
      },
      omdbDetails: {
        Title: 'Kingdom of the Planet of the Apes',
        Year: '2024',
        Rated: 'PG-13',
        Released: '10 May 2024',
        Runtime: '145 min',
        Genre: 'Action, Adventure, Sci-Fi',
        Director: 'Wes Ball',
        Writer: 'Josh Friedman, Rick Jaffa, Amanda Silver',
        Actors: 'Freya Allan, Kevin Durand, Dichen Lachman',
        Plot: "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past and make choices that will define a future for apes and humans alike.",
        Language: 'English',
        Country: 'United States',
        Awards: 'N/A',
        Poster:
          'https://m.media-amazon.com/images/M/MV5BZGI4NTEwNTAtZDcwMi00MDkxLTg1OGYtNTZmMzE3ZDljNzVlXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg',
        Ratings: [],
        Metascore: 'N/A',
        imdbRating: 'N/A',
        imdbVotes: 'N/A',
        imdbID: 'tt11389872',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: 'N/A',
        Production: 'N/A',
        Website: 'N/A',
        Response: 'True',
      },
      torrentDetails: {
        pirateBay: {
          provider: 'The Pirate Bay',
          id: '75257118',
          title:
            'Kingdom.of.the.Planet.of.the.Apes.2024.1080p.CAM.x264.Dual.YG⭐',
          time: 'Sat, 11 May 2024 14:42:36 GMT',
          seeds: 70,
          peers: 91,
          size: '3.6 GB',
          magnet:
            'magnet:?xt=urn:btih:B3C5C63ACB0DA0E3D1717C63D5E3F9C8AD78ADA7&dn=Kingdom.of.the.Planet.of.the.Apes.2024.1080p.CAM.x264.Dual.YG%E2%AD%90&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce',
          numFiles: 10,
          status: 'trusted',
          category: '210',
          imdb: '',
        },
        pirateBay2: {
          provider: 'The Pirate Bay',
          id: '75309917',
          title:
            'Kingdom.Of.The.Planet.Of.The.Apes.2024.1080p.TELESYNC.x264.Dual.Y',
          time: 'Sun, 19 May 2024 14:49:07 GMT',
          seeds: 47,
          peers: 113,
          size: '11.1 GB',
          magnet:
            'magnet:?xt=urn:btih:A94E3B6BCE0E120463434CBC14314E2281E9AD7C&dn=Kingdom.Of.The.Planet.Of.The.Apes.2024.1080p.TELESYNC.x264.Dual.Y&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce',
          numFiles: 10,
          status: 'trusted',
          category: '210',
          imdb: '',
        },
        pirateBay3: {
          provider: 'The Pirate Bay',
          id: '75265460',
          title:
            'Kingdom.of.the.Planet.of.the.Apes.2024.1080p.Re-Pack.CAM.x264.Dual.YG⭐',
          time: 'Sun, 12 May 2024 19:03:15 GMT',
          seeds: 13,
          peers: 46,
          size: '4.1 GB',
          magnet:
            'magnet:?xt=urn:btih:489196504FC4E071902090FB82B5E8C0C8F288F8&dn=Kingdom.of.the.Planet.of.the.Apes.2024.1080p.Re-Pack.CAM.x264.Dual.YG%E2%AD%90&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.pirateparty.gr%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce',
          numFiles: 10,
          status: 'trusted',
          category: '210',
          imdb: '',
        },
      },
    },
  },
}
