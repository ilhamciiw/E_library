<?php 


class Crud_upload extends CI_Controller{

	function __construct(){
		parent::__construct();		
		$this->load->model('m_data');
		$this->load->helper('url');

	}

	function index(){
		$this->load->view('v_upload');
	}

	public function video()
	{
		$this->load->view('v_upload1');
	}

	public function audio()
	{
		$this->load->view('v_upload2');
	}

	public function foto()
	{
		$this->load->view('v_upload3');
	}

	function tambah(){
		$this->load->view('v_inputdata');
	}


	function tambah_aksi(){
		$id_buku = $this->input->post('id_buku');
		$judul_buku = $this->input->post('judul_buku');
		$isbn = $this->input->post('isbn');
		$pengarang = $this->input->post('pengarang');
		$tahun = $this->input->post('tahun');
 
		$data = array(
			'id_buku' => $id_buku,
			'judul_buku' => $judul_buku,
			'isbn' => $isbn,
			'pengarang' => $pengarang,
			'tahun' => $tahun
			);
		$this->m_data->input_data($data,'user');
		redirect('crud/index');
	}
}