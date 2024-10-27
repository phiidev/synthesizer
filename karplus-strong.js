
//Pass in a buffer initialized to 0s.

//I actually haven't tested this lmao
function KPS(buffer, length, samplerate, frequency, lowpass, decay)
{
	
	const wavelength_samples = samplerate / frequency;
	
	//Put the impulse onto the buffer
	for (let i = 0; i < wavelength_samples; i++)
	{
		
		buffer[i] = Math.random();
		
	}
	
	for (let i = wavelength_samples; i < length; i++)
	{
		
		buffer[i] = (buffer[i - wavelength_samples] + (buffer[i - wavelength_samples - 1]||0) * lowpass) * frequency;
		
	}
	
	return buffer;
	
}
