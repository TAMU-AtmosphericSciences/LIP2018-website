/* 2-D Acoustic FDTD Simulation Solver in JavaScript (rev. Nov. 28th, 2014)
    by Yoshiki NAGATANI
      http://ultrasonics.jp/nagatani/e/
      https://twitter.com/nagataniyoshiki

  This is a truly physical simulation program of sound wave propagation
  in two-dimensional field filled with fluid media.

  This library is expected to be called by
    http://ultrasonics.jp/nagatani/fdtd/javascript/acoustic_2d_fdtd_lena256.html .
  Please see the document written in the html file.

  ==================================================================================
  [Variables]

   The followings should be defined as global variables in your main script.

   - dx: Spatical Resolution [m]
   - dt: Temporal Resolution [s]
   - dt_over_dx: dt/dx (for more efficient calculation)

   - NX: Spatial Size for X direction [pixels]
   - NY: Spatial Size for Y direction [pixels]

   - Vx: Particle Velocity for X direction [m/s] ==> 2-D Array: (NX+1 x NY)
   - Vy: Particle Velocity for Y direction [m/s] ==> 2-D Array: (NX x NY+1)
   - P:  Sound Pressure [Pa] ==> 2-D Array: (NX x NY)

   - rho:        Densities [kg/m^3] ==> 1-D Array: [Medium1, Medium2, ...]
   - kappa:      Bulk Moduli [Pa] ==> 1-D Array: [Medium1, Medium2, ...]
  ==================================================================================

*/

"use strict";


/* Initialize Field Values */
function InitField()
{
	var i,j;

	for(i=0;i<NX+1;i++){
		for(j=0;j<NY;j++){
			Vx[i][j] = 0.0;
		}
	}
	for(i=0;i<NX;i++){
		for(j=0;j<NY+1;j++){
			Vy[i][j] = 0.0;
		}
	}
	for(i=0;i<NX;i++){
		for(j=0;j<NY;j++){
			P[i][j]  = 0.0;
		}
	}
}

/* Update Particle Velocities */
function UpdateV()
{
	var i,j;

	for(i=1;i<NX;i++){
		for(j=0;j<NY;j++){
			Vx[i][j] += - dt_over_dx / ( (rho[Model[i][j]]+rho[Model[i-1][j]])/2.0 ) * ( P[i][j] - P[i-1][j] );
//			Vx[i][j] += - dt / ( dx * (rho[Model[i][j]]+rho[Model[i-1][j]])/2.0 ) * ( P[i][j] - P[i-1][j] );
		}
	}

	for(i=0;i<NX;i++){
		for(j=1;j<NY;j++){
			Vy[i][j] += - dt_over_dx / ( (rho[Model[i][j]]+rho[Model[i][j-1]])/2.0 ) * ( P[i][j] - P[i][j-1] );
//			Vy[i][j] += - dt / ( dx * (rho[Model[i][j]]+rho[Model[i][j-1]])/2.0 ) * ( P[i][j] - P[i][j-1] );
		}
	}
}

/* Update Sound Pressure */
function UpdateP()
{
	var i,j;

	for(i=0;i<NX;i++){
		for(j=0;j<NY;j++){
			P[i][j] += - ( kappa[Model[i][j]] * dt_over_dx )
			            * ( ( Vx[i+1][j] - Vx[i][j] ) + ( Vy[i][j+1] - Vy[i][j] ) );
//			P[i][j] += - ( kappa[Model[i][j]] * dt / dx )
//			            * ( ( Vx[i+1][j] - Vx[i][j] ) + ( Vy[i][j+1] - Vy[i][j] ) );
		}
	}
}
