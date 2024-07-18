$(document).ready(function() {
  const API_KEY = '444649e48a1ca7f83d87af64e74be009';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZDkxZWIxNGQ1Zjg2ZGU0ZjZlOTc5YmQ1ZDJmYjYzYiIsIm5iZiI6MTcyMTE1Njk3My4xMTI0MTgsInN1YiI6IjY2OTZiZDRiZTA4Y2NhZDM4NmEzOTc1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Q-BBW8pep4cU4LAkn9EGAKKZzWcojN2xu3LDvvWTq18`
    }
  };

  const nowPlayingMoviesEndpoint = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`;
  const moviesContainer = $('#movies-container');
  const loadingBar = $('#loading-bar');
  const errorMessage = $('.error-message');

  function fetchMovies(endpoint) {
    toggleLoading(true);
    fetch(endpoint, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(response => displayMovies(response.results))
      .catch(error => showError(error.message))
      .finally(() => toggleLoading(false));
  }

  function displayMovies(movies) {
    moviesContainer.empty();
    if (movies.length === 0) {
      moviesContainer.html('<p>No results found</p>');
      return;
    }

    movies.forEach(movie => {
      const movieElement = `
                <div class="col-md-2 movie" data-movie-id="${movie.id}">
                    <div class="movie-container">
                        <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
                        <div class="movie-details">
                            <h3 class="movie-title">${movie.title}</h3>
                            <p>${movie.overview}</p>
                        </div>
                    </div>
                </div>
            `;
      moviesContainer.append(movieElement);
    });

    $('.movie').hover(function() {
      $(this).find('.movie-details').toggleClass('active');
      $(this).find('img').toggleClass('darken');
    });
  }

  function toggleLoading(isLoading) {
    if (isLoading) {
      loadingBar.show();
      errorMessage.hide();
    } else {
      loadingBar.hide();
    }
  }

  function showError(message) {
    errorMessage.text(message).show();
  }

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  const debouncedSearchMovies = debounce(function(query) {
    searchMovies(query);
  }, 500);

  $('#search').on('input', function() {
    const query = $(this).val();
    if (query.length >= 3) {
      debouncedSearchMovies(query);
    }
  });

  function searchMovies(query) {
    toggleLoading(true);
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(response => displayMovies(response.results))
      .catch(error => showError(error.message))
      .finally(() => toggleLoading(false));
  }

  $('#now-playing').click(function(event) {
    event.preventDefault();
    fetchMovies(nowPlayingMoviesEndpoint);
  });

  $('#contact-form').submit(function(event) {
    event.preventDefault();
    const name = $('#name').val();
    const email = $('#email').val();
    const phone = $('#phone').val();
    const age = $('#age').val();
    const password = $('#password').val();
    const validatePassword = $('#validate-password').val();

    let valid = true;

    if (!name) {
      $('#name').addClass('is-invalid');
      valid = false;
    } else {
      $('#name').removeClass('is-invalid');
    }

    if (!validateEmail(email)) {
      $('#email').addClass('is-invalid');
      valid = false;
    } else {
      $('#email').removeClass('is-invalid');
    }

    if (!validatePhone(phone)) {
      $('#phone').addClass('is-invalid');
      valid = false;
    } else {
      $('#phone').removeClass('is-invalid');
    }

    if (!age || age < 0) {
      $('#age').addClass('is-invalid');
      valid = false;
    } else {
      $('#age').removeClass('is-invalid');
    }

    if (!password || password !== validatePassword) {
      $('#password').addClass('is-invalid');
      $('#validate-password').addClass('is-invalid');
      valid = false;
    } else {
      $('#password').removeClass('is-invalid');
      $('#validate-password').removeClass('is-invalid');
    }

    if (valid) {
      alert('Form submitted successfully!');
    } else {
      alert('Please correct the errors in the form');
    }
  });

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
  }

  $('#color-picker').on('change', function() {
    const color = $(this).val();
    $('body').css('--primary-color', color);
    localStorage.setItem('primaryColor', color);
  });

  const savedColor = localStorage.getItem('primaryColor');
  if (savedColor) {
    $('body').css('--primary-color', savedColor);
  }

  $('#sidebar-toggle').click(function() {
    $('#sidebar').toggleClass('open');
  });

  // Initial load
  fetchMovies(nowPlayingMoviesEndpoint);
});
