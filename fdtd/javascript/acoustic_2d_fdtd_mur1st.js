/* Mur's 1st order absorbing boundary for 2-D Acoustic FDTD (rev. Nov. 28th, 2014)
    by Yoshiki NAGATANI
      http://ultrasonics.jp/nagatani/e/
      https://twitter.com/nagataniyoshiki

  This is a library of Mur's 1st order absorbing boundary.
  (Mur's 1st order absorbing boundary is one of the easiest way to realize
   an absorbing boundary although its performance is not the best.)

  This library is expected to be called by
    http://ultrasonics.jp/nagatani/fdtd/javascript/acoustic_2d_fdtd_lena256.html .
  Please see the document written in the html file.

  ==================================================================================
  [Variables]

   The followings should be defined as global variables in your main script.

   - dx: Spatical Resolution [m]
   - dt: Temporal Resolution [s]

   - NX: Spatial Size for X direction [pixels]
   - NY: Spatial Size for Y direction [pixels]

   - P:  Sound Pressure [Pa] ==> 2-D Array: (NX x NY)

   - rho:        Densities [kg/m^3] ==> 1-D Array: [Medium1, Medium2, ...]
   - kappa:      Bulk Moduli [Pa] ==> 1-D Array: [Medium1, Medium2, ...]

   - Mur_X1: Mur's 1st order absorbing boundary ==> 2-D Array: (4 x NY)
   - Mur_Y1: Mur's 1st order absorbing boundary ==> 2-D Array: (NX x 4)
  ==================================================================================

*/

"use strict";


/* Initialize Mur1st Values */
function InitMur1st()
{
	var i,j;

	for(i=0;i<NX;i++){
		Mur_Y1[i][0] = 0.0;
		Mur_Y1[i][1] = 0.0;
		Mur_Y1[i][2] = 0.0;
		Mur_Y1[i][3] = 0.0;
	}
	for(j=0;j<NY;j++){
		Mur_X1[0][j] = 0.0;
		Mur_X1[1][j] = 0.0;
		Mur_X1[2][j] = 0.0;
		Mur_X1[3][j] = 0.0;
	}
}

/* Mur's 1st Order Absorption */
function Mur1st()
{
	var i,j;
	var vel;	// sound velocity [m/s]

	for(i=1;i<NX-1;i++){
		vel = Math.sqrt(kappa[Model[i][0]]/rho[Model[i][0]]);
		P[i][0] = Mur_Y1[i][1] + (vel*dt-dx)/(vel*dt+dx) * (P[i][1] - Mur_Y1[i][0]);
		vel = Math.sqrt(kappa[Model[i][NY-1]]/rho[Model[i][NY-1]]);
		P[i][NY-1] = Mur_Y1[i][2] + (vel*dt-dx)/(vel*dt+dx) * (P[i][NY-2] - Mur_Y1[i][3]);
	}
	for(j=1;j<NY-1;j++){
		vel = Math.sqrt(kappa[Model[0][j]]/rho[Model[0][j]]);
		P[0][j] = Mur_X1[1][j] + (vel*dt-dx)/(vel*dt+dx) * (P[1][j] - Mur_X1[0][j]);
		vel = Math.sqrt(kappa[Model[NX-1][j]]/rho[Model[NX-1][j]]);
		P[NX-1][j] = Mur_X1[2][j] + (vel*dt-dx)/(vel*dt+dx) * (P[NX-2][j] - Mur_X1[3][j]);
	}

	/* Copy Previous Values */
	Mur1stCopy();
}

/* Copy the Filed Values for Mur's 1st Order Absorption */
function Mur1stCopy()
{
	var i,j;

	/* Copy Previous Values */
	for(i=0;i<NX;i++){
		Mur_Y1[i][0] = P[i][0];
		Mur_Y1[i][1] = P[i][1];
		Mur_Y1[i][2] = P[i][NY-2];
		Mur_Y1[i][3] = P[i][NY-1];
	}
	for(j=0;j<NY;j++){
		Mur_X1[0][j] = P[0][j];
		Mur_X1[1][j] = P[1][j];
		Mur_X1[2][j] = P[NX-2][j];
		Mur_X1[3][j] = P[NX-1][j];
	}
}
