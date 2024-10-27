
//Pass in a buffer WITH ALL 0s to the waveguide and it'll work its magic

function Waveguide(buffer, length, samplerate = 44100, freq = 440, impulse_size = 1, noise_crossfade = 0.1, stiffness = 0.20, decay = 0.98, striking_position = 0.20)
{
	
	const wavelength_seconds = 1 / freq, wavelength_samples = samplerate / freq;
	
	let	total_delay = wavelength_samples - 2,
		K1 = total_delay * striking_position, K2 = total_delay * (1 - striking_position),
		impulse_size = 1;
	
	for (let i = 0, c = wavelength_samples / impulse_size; i < c; i++)
	{
		
		buffer[i] = Math.sin(i / samplerate * Math.PI * freq * impulse_size) * ((Math.random() + 1) / 2 * noise_crossfade + 1 - noise_crossfade);
		
	}
	
	for (let i = 0, c = length,
		
		last_ol = 0, last_or = 0,
		
		K1_ceil	= Math.ceil(K1), K1_trunc = K1 % 1,
		K2_ceil	= Math.ceil(K2), K2_trunc = K2 % 1,
		
		l_buffer = new Float32Array(K1_ceil), l_head = 0,
		r_buffer = new Float32Array(K2_ceil), r_head = 0,
		
		alpha = stiffness, feedback = decay,
		
		l_samplerate = samplerate;
		
		i < c; i++) {
		
		if (i == Math.ceil(wavelength_samples * 2) || i == Math.ceil(wavelength_samples * 3))
		{
			
			Plot(l_buffer, r_buffer, l_head, r_head);
			
		}
		
		const time = i / l_samplerate, impulse = buffer[i],
			
			//Allpass filter
			x1_n		= (impulse - last_or * feedback),
			v1_nm1		= l_buffer[(l_head + (K1_trunc != 0)) % K1_ceil] * (1 - K1_trunc) + l_buffer[l_head] * K1_trunc, //This is a delay
			v1_n		= x1_n - alpha * v1_nm1,
			y1_n		= alpha * x1_n - alpha * alpha * v1_nm1 + v1_nm1,
			
			//Allpass filter
			x2_n		= (impulse - last_ol * feedback),
			v2_nm1		= r_buffer[(r_head + (K2_trunc != 0)) % K2_ceil] * (1 - K2_trunc) + r_buffer[r_head] * K2_trunc, //This is also a delay
			v2_n		= x2_n - alpha * v2_nm1,
			y2_n		= alpha * x2_n - alpha * alpha * v2_nm1 + v2_nm1;
		
		l_buffer[l_head] = v1_n; l_head = (l_head+1) % K1_ceil;
		r_buffer[r_head] = v2_n; r_head = (r_head+1) % K2_ceil;
		
		buffer[i] = y1_n + y2_n;
		last_ol = y1_n;
		last_or = y2_n;
	}
	
}
