import { generateTheme, useMode } from '@kanban/theme';
import { Visibility } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';
import { useState } from 'react';
import PrimaryNav from '../primaryNav';
import SecondaryNav from '../secondaryNav';

export default function Layout({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const { activeMode } = useMode();
  const [isSecondaryNavOpen, setIsSecondaryNavOpen] = useState<boolean>(true);
  const theme = generateTheme(activeMode);

  return (
    <>
      <Box
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
        }}
      >
        <SecondaryNav
          isSecondaryNavOpen={isSecondaryNavOpen}
          closeSecondaryNav={() => setIsSecondaryNavOpen(false)}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            height: '100%',
          }}
        >
          <PrimaryNav isSecondaryNavOpen={isSecondaryNavOpen} />
          <Box sx={{ position: 'relative', padding: 3 }}>
            <Tooltip arrow title="Show Sidebar">
              <Box
                component={Button}
                variant="contained"
                color="primary"
                sx={{
                  position: 'absolute',
                  left: 0,
                  bottom: '32px',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.common.white,
                  padding: 1.8125,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  alignItems: 'center',
                  cursor: 'pointer',
                  display: isSecondaryNavOpen ? 'none' : 'grid',
                }}
                onClick={() => setIsSecondaryNavOpen(true)}
              >
                <Visibility />
              </Box>
            </Tooltip>
            {children}
            {/* <Columns columns={[]} /> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
