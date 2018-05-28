import { chordToNashville, linesToNashville } from '../convertToNashville';

describe( 'chordToNashville function', () => {

	it( 'should convert chords correctly for C', () => {

		expect( chordToNashville( 'C', 'C' ) ).toEqual( '1' );

	} );

	it( 'should convert chords correctly for Bb', () => {

		expect( chordToNashville( 'Bb', 'Bb' ) ).toEqual( '1' );
		expect( chordToNashville( 'Bb', 'Cm' ) ).toEqual( '2m' );
		expect( chordToNashville( 'Bb', 'Eb' ) ).toEqual( '4' );
		expect( chordToNashville( 'Bb', 'Dm' ) ).toEqual( '3m' );
		expect( chordToNashville( 'Bb', 'Gm' ) ).toEqual( '6m' );

	} );

} );

describe( 'linesToNashville function', () => {

	const lines = [
		{ chords: { 0: '', 8: 'Bb', 47: 'Cm', 57: 'Eb', _sort: [] } }
	];

	it( 'should convert chords correctly for Bb', () => {

		expect( linesToNashville( 'Bb', lines ) ).toEqual( [
			{ chords: { 0: '', 8: '1', 47: '2m', 57: '4', _sort: [] } }
		] );

	} );

} );