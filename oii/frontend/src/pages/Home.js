import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const heroSlides = [
  {
    image: '/images/hero-1.jpg',
    title: 'New Spring Collection',
    description: 'Discover the latest trends for the season',
    link: '/products?category=new',
  },
  {
    image: '/images/hero-2.jpg',
    title: 'Summer Sale',
    description: 'Up to 50% off on selected items',
    link: '/products?category=sale',
  },
  {
    image: '/images/hero-3.jpg',
    title: 'Exclusive Designs',
    description: 'Shop our designer collections',
    link: '/products?category=designer',
  },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: '/images/product-1.jpg',
    category: 'men',
  },
  {
    id: 2,
    name: 'Floral Summer Dress',
    price: 79.99,
    image: '/images/product-2.jpg',
    category: 'women',
  },
  {
    id: 3,
    name: 'Denim Jacket',
    price: 89.99,
    image: '/images/product-3.jpg',
    category: 'men',
  },
  {
    id: 4,
    name: 'Leather Handbag',
    price: 129.99,
    image: '/images/product-4.jpg',
    category: 'accessories',
  },
];

function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', mb: 6 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '60vh', md: '80vh' },
                  backgroundColor: 'grey.300',
                }}
              >
                <Box
                  component="img"
                  src={slide.image}
                  alt={slide.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {slide.description}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={slide.link}
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        },
                      }}
                    >
                      Shop Now
                    </Button>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Featured Products
        </Typography>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="body1" color="primary" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={RouterLink}
                    to={`/product/${product.id}`}
                    size="small"
                    color="primary"
                  >
                    View Details
                  </Button>
                  <Button size="small" color="primary">
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Shop by Category
          </Typography>
          <Grid container spacing={4}>
            {['Men', 'Women', 'Kids', 'Accessories'].map((category) => (
              <Grid item key={category} xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover img': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/category-${category.toLowerCase()}.jpg`}
                    alt={category}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: '0.3s',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="h5"
                      component={RouterLink}
                      to={`/products?category=${category.toLowerCase()}`}
                      sx={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 700,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {category}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
