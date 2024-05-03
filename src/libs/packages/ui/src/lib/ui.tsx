import React, { useState, useEffect } from 'react';
import styles from './ui.module.css';
import { Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface UiProps {}

export function Ui(props: UiProps) {
  return (
    <Box component="main">
      <Typography variant="h2">Welcome to MonoPando Admin Template Storybook!</Typography>
      <Grid container direction="column">
        <div className={styles['container']}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            vulputate elit tincidunt consequat ornare. Praesent id odio non mauris
            porta elementum eget nec nibh. Donec scelerisque ut nisl ut mattis.
            Suspendisse eget accumsan dolor. Cras ut hendrerit tortor. Aenean eu
            maximus enim. Nam sem urna, dictum ut orci quis, elementum gravida
            nulla. Donec blandit odio in lorem efficitur, a placerat lectus
            ullamcorper. Vestibulum libero risus, lacinia quis neque in, ultricies
            consequat augue. Curabitur leo nisl, vestibulum non convallis
            efficitur, semper sed eros. Suspendisse sed est eros. Ut est risus,
            vestibulum viverra efficitur at, semper nec lectus. Curabitur maximus
            aliquam nibh, ac rutrum ligula commodo ut. Proin aliquet odio in sem
            lobortis, interdum consectetur risus lobortis. Aliquam tincidunt
            tristique est, in finibus neque volutpat in. Proin mattis et metus
            eget tempor. Fusce orci justo, convallis lacinia lobortis eu, sodales
            et nulla. Sed sodales enim pretium leo dignissim faucibus. In
            condimentum venenatis sem quis hendrerit. Proin eu malesuada turpis,
            ac efficitur mauris. Integer ac dignissim ipsum, id maximus turpis.
            Etiam at justo varius, tincidunt ligula at, gravida metus. Praesent
            ultricies, odio a dapibus rhoncus, neque justo eleifend mi, cursus
            tincidunt ipsum enim nec arcu. Praesent fringilla felis nec luctus
            molestie. Ut et porta nulla. Nam bibendum lectus enim, ut mattis felis
            efficitur eget. In tortor magna, ullamcorper ut leo ac, ultricies
            accumsan mi. Suspendisse massa nisi, faucibus porta purus sed,
            faucibus dignissim dolor. Cras malesuada ornare tellus, eu rhoncus
            tellus. Nullam venenatis, risus quis mollis auctor, felis mauris
            rhoncus purus, et elementum lacus arcu at dui. Aenean ultrices
            accumsan eros in facilisis. Nam venenatis pellentesque augue, non
            sagittis ex malesuada et. Ut pretium dui vitae tortor
          </Typography>
        </div>
      </Grid>
    </Box>
  );
}

export default Ui;
